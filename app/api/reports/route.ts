import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth';
import { generateVoCReport } from '@/lib/ai/reports';

export async function GET(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const reports = await db.report.findMany({
    where: { workspaceId: sessionUser.workspaceId },
    orderBy: { createdAt: 'desc' },
  });

  const parsedReports = reports.map((r) => ({
    id: r.id,
    title: r.title,
    periodStart: r.periodStart,
    periodEnd: r.periodEnd,
    createdAt: r.createdAt,
    content: JSON.parse(r.contentJson),
  }));

  return NextResponse.json({ data: parsedReports });
}

export async function POST(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireRole(['ADMIN', 'ANALYST']);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json().catch(() => ({}));
    const periodDays = parseInt(body.periodDays || '30', 10);

    const report = await generateVoCReport(sessionUser.workspaceId, periodDays, sessionUser.id);

    return NextResponse.json(report, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Report Generation Error', message: (err as Error).message }, { status: 500 });
  }
}
