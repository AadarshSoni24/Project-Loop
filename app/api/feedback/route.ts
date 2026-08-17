import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth';
import { classifyFeedback } from '@/lib/ai/classifier';
import { generateSimpleEmbedding } from '@/lib/ai/rag';
import { z } from 'zod';

type Sentiment = 'POS' | 'NEU' | 'NEG';
type FeedbackStatus = 'NEW' | 'REVIEWED' | 'ACTIONED';

const CreateFeedbackSchema = z.object({
  content: z.string().min(3, 'Feedback content must be at least 3 characters long.'),
  channel: z.string().default('support_ticket'),
  sourceRef: z.string().optional(),
  customerLabel: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const skip = (page - 1) * limit;

  const channel = url.searchParams.get('channel');
  const sentiment = url.searchParams.get('sentiment') as Sentiment | null;
  const status = url.searchParams.get('status') as FeedbackStatus | null;
  const themeId = url.searchParams.get('themeId');
  const search = url.searchParams.get('search');
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');

  const where: any = {
    workspaceId: sessionUser.workspaceId,
  };

  if (channel) where.channel = channel;
  if (sentiment) where.sentiment = sentiment;
  if (status) where.status = status;
  if (themeId) {
    where.themes = {
      some: {
        themeId,
      },
    };
  }

  if (search && search.trim() !== '') {
    where.content = {
      contains: search.trim(),
    };
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [items, totalCount] = await Promise.all([
    db.feedback.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        themes: {
          include: {
            theme: true,
          },
        },
      },
    }),
    db.feedback.count({ where }),
  ]);

  return NextResponse.json({
    data: items,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireRole(['ADMIN', 'ANALYST']);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const validated = CreateFeedbackSchema.parse(body);

    const existingThemes = await db.theme.findMany({
      where: { workspaceId: sessionUser.workspaceId },
      select: { name: true },
    });
    const themeNames = existingThemes.map((t) => t.name);

    const classification = await classifyFeedback(validated.content, themeNames);

    const newFeedback = await db.feedback.create({
      data: {
        content: validated.content,
        channel: validated.channel,
        sourceRef: validated.sourceRef,
        customerLabel: validated.customerLabel,
        sentiment: classification.sentiment,
        sentimentScore: classification.sentimentScore,
        featureArea: classification.featureArea,
        status: 'NEW',
        workspaceId: sessionUser.workspaceId,
      },
    });

    for (const tName of classification.themes) {
      let theme = await db.theme.findFirst({
        where: {
          workspaceId: sessionUser.workspaceId,
          name: { equals: tName },
        },
      });

      if (!theme) {
        theme = await db.theme.create({
          data: {
            name: tName,
            description: `Auto-generated theme for ${tName}`,
            workspaceId: sessionUser.workspaceId,
          },
        });
      }

      await db.feedbackTheme.create({
        data: {
          feedbackId: newFeedback.id,
          themeId: theme.id,
          confidence: 0.9,
        },
      });
    }

    const vector = generateSimpleEmbedding(validated.content);
    await db.embedding.create({
      data: {
        feedbackId: newFeedback.id,
        vector: JSON.stringify(vector),
      },
    });

    const fullFeedback = await db.feedback.findUnique({
      where: { id: newFeedback.id },
      include: {
        themes: {
          include: { theme: true },
        },
      },
    });

    return NextResponse.json(fullFeedback, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error', message: (error as Error).message }, { status: 500 });
  }
}
