import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { askLoopQuestion } from '@/lib/ai/rag';
import { z } from 'zod';

const AskQuestionSchema = z.object({
  question: z.string().min(3, 'Question must be at least 3 characters long.'),
});

export async function POST(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const validated = AskQuestionSchema.parse(body);

    const result = await askLoopQuestion(sessionUser.workspaceId, validated.question);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Ask LOOP Error', message: (error as Error).message }, { status: 500 });
  }
}
