import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth';
import { classifyFeedback } from '@/lib/ai/classifier';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { sessionUser, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const feedbackId = params.id;
    const feedback = await db.feedback.findFirst({
      where: {
        id: feedbackId,
        workspaceId: sessionUser.workspaceId,
      },
      include: {
        themes: {
          include: {
            theme: true,
          },
        },
        embedding: true,
      },
    });

    if (!feedback) {
      return NextResponse.json({ error: 'Not Found', message: 'Feedback record not found or access denied.' }, { status: 404 });
    }

    return NextResponse.json(feedback);
  } catch (err) {
    return NextResponse.json({ error: 'Fetch Error', message: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { sessionUser, errorResponse } = await requireRole(['ADMIN', 'ANALYST']);
  if (errorResponse) return errorResponse;

  try {
    const feedbackId = params.id;
    const body = await req.json();

    const existing = await db.feedback.findFirst({
      where: { id: feedbackId, workspaceId: sessionUser.workspaceId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not Found', message: 'Feedback record not found or access denied.' }, { status: 404 });
    }

    if (body.status && ['NEW', 'REVIEWED', 'ACTIONED'].includes(body.status)) {
      const updated = await db.feedback.update({
        where: { id: feedbackId },
        data: { status: body.status },
      });
      return NextResponse.json(updated);
    }

    if (body.action === 'reclassify') {
      const existingThemes = await db.theme.findMany({
        where: { workspaceId: sessionUser.workspaceId },
        select: { name: true },
      });
      const themeNames = existingThemes.map((t) => t.name);

      const classification = await classifyFeedback(existing.content, themeNames);

      const updated = await db.feedback.update({
        where: { id: feedbackId },
        data: {
          sentiment: classification.sentiment,
          sentimentScore: classification.sentimentScore,
          featureArea: classification.featureArea,
        },
      });

      return NextResponse.json({ message: 'Re-classification complete', data: updated });
    }

    return NextResponse.json({ error: 'Invalid Request', message: 'No valid update field provided.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Update Error', message: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { sessionUser, errorResponse } = await requireRole(['ADMIN', 'ANALYST']);
  if (errorResponse) return errorResponse;

  try {
    const feedbackId = params.id;
    const existing = await db.feedback.findFirst({
      where: { id: feedbackId, workspaceId: sessionUser.workspaceId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not Found', message: 'Feedback record not found or access denied.' }, { status: 404 });
    }

    await db.feedback.delete({ where: { id: feedbackId } });
    return NextResponse.json({ success: true, id: feedbackId });
  } catch (err) {
    return NextResponse.json({ error: 'Delete Error', message: (err as Error).message }, { status: 500 });
  }
}
