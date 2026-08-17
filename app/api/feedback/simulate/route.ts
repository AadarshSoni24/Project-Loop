import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { classifyFeedback } from '@/lib/ai/classifier';
import { generateSimpleEmbedding } from '@/lib/ai/rag';

const SAMPLE_CHANNELS = [
  { channel: 'support_ticket', label: 'Zendesk Ticket #4920' },
  { channel: 'app_store', label: 'App Store 4-Star Review' },
  { channel: 'nps_survey', label: 'CSAT Post-Onboarding' },
  { channel: 'sales_call', label: 'Gong Call Note — Enterprise Prospect' },
  { channel: 'community_post', label: 'Discord Community #feedback' },
];

const SAMPLE_FEEDBACK_PROMPTS = [
  'Prospect requested SAML SSO integration before agreeing to contract renewal. This is the 4th enterprise prospect asking this month.',
  'Onboarding wizard gets stuck on step 2 when inviting team members with non-standard email domains.',
  'The exported CSV files are missing customer timestamp columns, making financial audit reconciliation tedious.',
  'Extremely impressed with the speed of the new analytics dashboard! Saved our product team hours this week.',
  'Mobile app crashes immediately on launch after updating to iOS 18. Urgent fix needed!',
  'Billing invoices page times out when attempting to download PDFs from multi-workspace accounts.',
];

export async function POST(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireRole(['ADMIN', 'ANALYST']);
  if (errorResponse) return errorResponse;

  try {
    const randomChannel = SAMPLE_CHANNELS[Math.floor(Math.random() * SAMPLE_CHANNELS.length)];
    const randomContent = SAMPLE_FEEDBACK_PROMPTS[Math.floor(Math.random() * SAMPLE_FEEDBACK_PROMPTS.length)];

    const existingThemes = await db.theme.findMany({
      where: { workspaceId: sessionUser.workspaceId },
      select: { name: true },
    });
    const themeNames = existingThemes.map((t) => t.name);

    const classification = await classifyFeedback(randomContent, themeNames);

    const created = await db.feedback.create({
      data: {
        content: randomContent,
        channel: randomChannel.channel,
        customerLabel: randomChannel.label,
        sentiment: classification.sentiment,
        sentimentScore: classification.sentimentScore,
        featureArea: classification.featureArea,
        status: 'NEW',
        workspaceId: sessionUser.workspaceId,
      },
    });

    for (const tName of classification.themes) {
      let theme = await db.theme.findFirst({
        where: { workspaceId: sessionUser.workspaceId, name: { equals: tName } },
      });

      if (!theme) {
        theme = await db.theme.create({
          data: { name: tName, description: `Auto theme for ${tName}`, workspaceId: sessionUser.workspaceId },
        });
      }

      await db.feedbackTheme.create({
        data: { feedbackId: created.id, themeId: theme.id, confidence: 0.9 },
      });
    }

    const vector = generateSimpleEmbedding(randomContent);
    await db.embedding.create({
      data: { feedbackId: created.id, vector: JSON.stringify(vector) },
    });

    const fullItem = await db.feedback.findUnique({
      where: { id: created.id },
      include: { themes: { include: { theme: true } } },
    });

    return NextResponse.json(fullItem, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Simulation Error', message: (err as Error).message }, { status: 500 });
  }
}
