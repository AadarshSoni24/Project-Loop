import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { classifyFeedback } from '@/lib/ai/classifier';
import { generateSimpleEmbedding } from '@/lib/ai/rag';

export async function POST(req: NextRequest) {
  // Guard: Only ANALYST or ADMIN can perform bulk upload
  const { sessionUser, errorResponse } = await requireRole(['ADMIN', 'ANALYST']);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { csvContent, items: rawItems } = body;

    let itemsToProcess: { content: string; channel?: string; customer_label?: string }[] = [];

    if (Array.isArray(rawItems)) {
      itemsToProcess = rawItems;
    } else if (typeof csvContent === 'string') {
      // Simple robust CSV parser
      const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        return NextResponse.json({ error: 'Invalid CSV', message: 'CSV file must contain a header line and at least one data row.' }, { status: 400 });
      }

      const header = lines[0].toLowerCase().split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      const contentIdx = header.indexOf('content');
      const channelIdx = header.indexOf('channel');
      const customerIdx = header.indexOf('customer_label') !== -1 ? header.indexOf('customer_label') : header.indexOf('customerlabel');

      if (contentIdx === -1) {
        return NextResponse.json({ error: 'Missing Required Header', message: "CSV header must contain a 'content' column." }, { status: 400 });
      }

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''));
        if (row[contentIdx]) {
          itemsToProcess.push({
            content: row[contentIdx],
            channel: channelIdx !== -1 && row[channelIdx] ? row[channelIdx] : 'csv_upload',
            customer_label: customerIdx !== -1 && row[customerIdx] ? row[customerIdx] : undefined,
          });
        }
      }
    }

    if (itemsToProcess.length === 0) {
      return NextResponse.json({ error: 'No Data', message: 'No valid feedback rows found to import.' }, { status: 400 });
    }

    const existingThemes = await db.theme.findMany({
      where: { workspaceId: sessionUser.workspaceId },
      select: { name: true },
    });
    const themeNames = existingThemes.map((t) => t.name);

    let importedCount = 0;
    let failedCount = 0;

    for (const item of itemsToProcess) {
      try {
        if (!item.content || item.content.trim().length < 3) {
          failedCount++;
          continue;
        }

        const classification = await classifyFeedback(item.content, themeNames);

        const created = await db.feedback.create({
          data: {
            content: item.content,
            channel: item.channel || 'csv_upload',
            customerLabel: item.customer_label || null,
            sentiment: classification.sentiment,
            sentimentScore: classification.sentimentScore,
            featureArea: classification.featureArea,
            status: 'NEW',
            workspaceId: sessionUser.workspaceId,
          },
        });

        // Attach themes
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
            data: { feedbackId: created.id, themeId: theme.id, confidence: 0.85 },
          });
        }

        // Embedding vector
        const vector = generateSimpleEmbedding(item.content);
        await db.embedding.create({
          data: { feedbackId: created.id, vector: JSON.stringify(vector) },
        });

        importedCount++;
      } catch (err) {
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalRows: itemsToProcess.length,
        importedCount,
        failedCount,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Bulk Ingest Error', message: (error as Error).message }, { status: 500 });
  }
}
