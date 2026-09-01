import { db } from '@/lib/db';

export interface DailyVolumeEntry {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface ThemeTrendSummary {
  themeId: string;
  themeName: string;
  color: string;
  totalFeedbackCount: number;
  currentPeriodCount: number;
  previousPeriodCount: number;
  changePercentage: number;
  isSpiking: boolean; // Flagged if growth > +30%
  sentimentBreakdown: {
    POS: number;
    NEU: number;
    NEG: number;
  };
  dailyVolume: DailyVolumeEntry[];
}

/**
 * AI2: Theme Clustering & Trend Spike Detection Service
 * Optimized: Uses targeted count queries instead of fetching all feedback rows.
 */
export async function getThemeTrends(
  workspaceId: string,
  periodDays: number = 7
): Promise<ThemeTrendSummary[]> {
  const now = new Date();
  const currentPeriodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
  const previousPeriodStart = new Date(now.getTime() - periodDays * 2 * 24 * 60 * 60 * 1000);

  // Fetch only theme metadata (no nested feedback)
  const themes = await db.theme.findMany({
    where: { workspaceId },
    select: { id: true, name: true, color: true },
  });

  if (themes.length === 0) return [];

  const themeIds = themes.map((t) => t.id);

  // Batch all count queries in parallel instead of loading all feedback rows
  const [totalCounts, currentCounts, previousCounts, sentimentCounts, dailyData] =
    await Promise.all([
      // Total feedback count per theme
      db.feedbackTheme.groupBy({
        by: ['themeId'],
        where: { themeId: { in: themeIds } },
        _count: { feedbackId: true },
      }),

      // Current period count per theme
      db.feedbackTheme.groupBy({
        by: ['themeId'],
        where: {
          themeId: { in: themeIds },
          feedback: { createdAt: { gte: currentPeriodStart } },
        },
        _count: { feedbackId: true },
      }),

      // Previous period count per theme
      db.feedbackTheme.groupBy({
        by: ['themeId'],
        where: {
          themeId: { in: themeIds },
          feedback: {
            createdAt: { gte: previousPeriodStart, lt: currentPeriodStart },
          },
        },
        _count: { feedbackId: true },
      }),

      // Sentiment breakdown per theme (current period only for relevance)
      db.feedbackTheme.findMany({
        where: {
          themeId: { in: themeIds },
        },
        select: {
          themeId: true,
          feedback: {
            select: { sentiment: true },
          },
        },
      }),

      // Daily volume for current period - lightweight
      db.feedbackTheme.findMany({
        where: {
          themeId: { in: themeIds },
          feedback: { createdAt: { gte: currentPeriodStart } },
        },
        select: {
          themeId: true,
          feedback: {
            select: { createdAt: true },
          },
        },
      }),
    ]);

  // Build lookup maps
  const totalMap = Object.fromEntries(
    totalCounts.map((g) => [g.themeId, g._count.feedbackId])
  );
  const currentMap = Object.fromEntries(
    currentCounts.map((g) => [g.themeId, g._count.feedbackId])
  );
  const previousMap = Object.fromEntries(
    previousCounts.map((g) => [g.themeId, g._count.feedbackId])
  );

  // Build sentiment breakdown map
  const sentimentMap: Record<string, { POS: number; NEU: number; NEG: number }> = {};
  sentimentCounts.forEach((ft) => {
    if (!sentimentMap[ft.themeId]) {
      sentimentMap[ft.themeId] = { POS: 0, NEU: 0, NEG: 0 };
    }
    const s = ft.feedback.sentiment;
    if (s === 'POS' || s === 'NEU' || s === 'NEG') {
      sentimentMap[ft.themeId][s]++;
    }
  });

  // Build daily volume map
  const dateLabels: string[] = [];
  for (let d = 0; d < periodDays; d++) {
    const dt = new Date(currentPeriodStart.getTime() + d * 24 * 60 * 60 * 1000);
    dateLabels.push(dt.toISOString().split('T')[0]);
  }

  const dailyVolumeMap: Record<string, Record<string, number>> = {};
  dailyData.forEach((ft) => {
    if (!dailyVolumeMap[ft.themeId]) {
      dailyVolumeMap[ft.themeId] = {};
      dateLabels.forEach((d) => (dailyVolumeMap[ft.themeId][d] = 0));
    }
    const dayKey = ft.feedback.createdAt.toISOString().split('T')[0];
    if (dailyVolumeMap[ft.themeId][dayKey] !== undefined) {
      dailyVolumeMap[ft.themeId][dayKey]++;
    }
  });

  const summaries: ThemeTrendSummary[] = themes.map((theme) => {
    const currentCount = currentMap[theme.id] || 0;
    const previousCount = previousMap[theme.id] || 0;
    const totalFeedbackCount = totalMap[theme.id] || 0;

    let changePercentage = 0;
    if (previousCount > 0) {
      changePercentage = Math.round(((currentCount - previousCount) / previousCount) * 100);
    } else if (currentCount > 0) {
      changePercentage = 100;
    }

    const isSpiking = changePercentage >= 30 && currentCount >= 3;

    const dailyVolume: DailyVolumeEntry[] = dateLabels.map((date) => ({
      date,
      count: dailyVolumeMap[theme.id]?.[date] || 0,
    }));

    return {
      themeId: theme.id,
      themeName: theme.name,
      color: theme.color,
      totalFeedbackCount,
      currentPeriodCount: currentCount,
      previousPeriodCount: previousCount,
      changePercentage,
      isSpiking,
      sentimentBreakdown: sentimentMap[theme.id] || { POS: 0, NEU: 0, NEG: 0 },
      dailyVolume,
    };
  });

  return summaries.sort((a, b) => b.totalFeedbackCount - a.totalFeedbackCount);
}
