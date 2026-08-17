import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';
import { getThemeTrends } from './clustering';

export interface VoCReportContent {
  title: string;
  summary: string;
  periodStats: {
    totalVolume: number;
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
    negativeRatio: number;
  };
  topThemes: { name: string; count: number; changePercentage: number; isSpiking: boolean }[];
  notableQuotes: { content: string; channel: string; sentiment: string }[];
  recommendedActions: string[];
}

/**
 * AI4: Voice-of-Customer (VoC) Report Generator Service
 */
export async function generateVoCReport(
  workspaceId: string,
  periodDays: number = 30,
  userId?: string
): Promise<{ id: string; title: string; periodStart: Date; periodEnd: Date; content: VoCReportContent }> {
  const periodEnd = new Date();
  const periodStart = new Date(periodEnd.getTime() - periodDays * 24 * 60 * 60 * 1000);

  // 1. Fetch period feedback
  const feedbackItems = await db.feedback.findMany({
    where: {
      workspaceId,
      createdAt: { gte: periodStart, lte: periodEnd },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalVolume = feedbackItems.length;
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;

  feedbackItems.forEach((item) => {
    if (item.sentiment === 'POS') positiveCount++;
    else if (item.sentiment === 'NEU') neutralCount++;
    else if (item.sentiment === 'NEG') negativeCount++;
  });

  const negativeRatio = totalVolume > 0 ? Math.round((negativeCount / totalVolume) * 100) : 0;

  // 2. Fetch theme trends
  const themeTrends = await getThemeTrends(workspaceId, periodDays);
  const topThemes = themeTrends.slice(0, 5).map((t) => ({
    name: t.themeName,
    count: t.totalFeedbackCount,
    changePercentage: t.changePercentage,
    isSpiking: t.isSpiking,
  }));

  // 3. Select notable quotes
  const negativeQuotes = feedbackItems
    .filter((f) => f.sentiment === 'NEG')
    .slice(0, 3)
    .map((f) => ({ content: f.content, channel: f.channel, sentiment: f.sentiment }));

  const positiveQuotes = feedbackItems
    .filter((f) => f.sentiment === 'POS')
    .slice(0, 2)
    .map((f) => ({ content: f.content, channel: f.channel, sentiment: f.sentiment }));

  const notableQuotes = [...negativeQuotes, ...positiveQuotes];

  // 4. Default recommended actions derived from data
  const defaultActions: string[] = [];
  const spikingThemes = topThemes.filter((t) => t.isSpiking);
  if (spikingThemes.length > 0) {
    defaultActions.push(`Investigate spike in theme '${spikingThemes[0].name}' (growth of +${spikingThemes[0].changePercentage}%).`);
  }
  if (negativeRatio > 35) {
    defaultActions.push(`Address customer friction in billing/onboarding to reduce high negative sentiment ratio (${negativeRatio}%).`);
  } else {
    defaultActions.push(`Capitalize on positive feedback momentum by highlighting dashboard speed improvements in marketing updates.`);
  }
  defaultActions.push(`Schedule cross-functional product-support review for top requested features.`);

  let executiveSummary = `During this ${periodDays}-day period, your workspace recorded ${totalVolume} feedback items. Sentiment remains balanced with ${positiveCount} positive, ${neutralCount} neutral, and ${negativeCount} negative responses (${negativeRatio}% negative ratio).`;

  // 5. Try Claude API for executive narrative polish if key exists
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const prompt = `You are a Head of Product writing a Executive Voice-of-Customer (VoC) Digest report.
Summarize the following customer feedback data into a sleek, professional executive digest.

Data:
- Period: ${periodDays} days (${periodStart.toISOString().split('T')[0]} to ${periodEnd.toISOString().split('T')[0]})
- Total Volume: ${totalVolume} feedback entries
- Sentiment Breakdown: ${positiveCount} Positive, ${neutralCount} Neutral, ${negativeCount} Negative (${negativeRatio}% negative)
- Top Themes: ${topThemes.map((t) => `${t.name} (${t.count} items, ${t.changePercentage}% change)`).join(', ')}
- Notable Quotes: ${notableQuotes.map((q) => `"${q.content}"`).join('; ')}

Return a short 2-3 paragraph executive summary text highlighting key takeaways, friction points, and opportunities.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      });

      const firstBlock = response.content[0];
      if (firstBlock && firstBlock.type === 'text') {
        executiveSummary = firstBlock.text;
      }
    } catch (e) {
      console.warn('Claude report generation failed, using structured local summary:', e);
    }
  }

  const reportTitle = `Voice of Customer Executive Digest — ${periodEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const reportContent: VoCReportContent = {
    title: reportTitle,
    summary: executiveSummary,
    periodStats: {
      totalVolume,
      positiveCount,
      neutralCount,
      negativeCount,
      negativeRatio,
    },
    topThemes,
    notableQuotes,
    recommendedActions: defaultActions,
  };

  // 6. Save report record in database
  const savedReport = await db.report.create({
    data: {
      title: reportTitle,
      periodStart,
      periodEnd,
      contentJson: JSON.stringify(reportContent),
      workspaceId,
      generatedBy: userId || null,
    },
  });

  return {
    id: savedReport.id,
    title: savedReport.title,
    periodStart: savedReport.periodStart,
    periodEnd: savedReport.periodEnd,
    content: reportContent,
  };
}
