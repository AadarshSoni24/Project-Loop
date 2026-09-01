import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth';
import { getThemeTrends } from '@/lib/ai/clustering';

export async function GET(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const url = new URL(req.url);
  const periodDays = parseInt(url.searchParams.get('days') || '7', 10);

  // Return theme trends and spike detection
  const trends = await getThemeTrends(sessionUser.workspaceId, periodDays);
  const response = NextResponse.json({ data: trends });
  response.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=60");
  return response;
}

export async function POST(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireRole(['ADMIN', 'ANALYST']);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { name, description, color } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Validation Error', message: 'Theme name must be at least 2 characters.' }, { status: 400 });
    }

    const theme = await db.theme.create({
      data: {
        name: name.trim(),
        description: description || null,
        color: color || '#3b82f6',
        workspaceId: sessionUser.workspaceId,
      },
    });

    return NextResponse.json(theme, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Create Theme Error', message: (err as Error).message }, { status: 500 });
  }
}
