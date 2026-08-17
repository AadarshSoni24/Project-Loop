import { db } from '@/lib/db';

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
}

/**
 * AI2: Theme Clustering & Trend Spike Detection Service
 * Analyzes workspace theme counts over current vs previous period to calculate deltas & flag spikes.
 */
export async function getThemeTrends(
  workspaceId: string,
  periodDays: number = 7
): Promise<ThemeTrendSummary[]> {
  const now = new Date();
  const currentPeriodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
  const previousPeriodStart = new Date(now.getTime() - periodDays * 2 * 24 * 60 * 60 * 1000);

  const themes = await db.theme.findMany({
    where: { workspaceId },
    include: {
      feedback: {
        include: {
          feedback: true,
        },
      },
    },
  });

  const summaries: ThemeTrendSummary[] = themes.map((theme) => {
    let currentCount = 0;
    let previousCount = 0;
    const sentimentBreakdown = { POS: 0, NEU: 0, NEG: 0 };

    theme.feedback.forEach((ft) => {
      const fb = ft.feedback;
      if (fb.createdAt >= currentPeriodStart) {
        currentCount++;
      } else if (fb.createdAt >= previousPeriodStart && fb.createdAt < currentPeriodStart) {
        previousCount++;
      }

      if (fb.sentiment === 'POS') sentimentBreakdown.POS++;
      else if (fb.sentiment === 'NEU') sentimentBreakdown.NEU++;
      else if (fb.sentiment === 'NEG') sentimentBreakdown.NEG++;
    });

    let changePercentage = 0;
    if (previousCount > 0) {
      changePercentage = Math.round(((currentCount - previousCount) / previousCount) * 100);
    } else if (currentCount > 0) {
      changePercentage = 100;
    }

    const isSpiking = changePercentage >= 30 && currentCount >= 3;

    return {
      themeId: theme.id,
      themeName: theme.name,
      color: theme.color,
      totalFeedbackCount: theme.feedback.length,
      currentPeriodCount: currentCount,
      previousPeriodCount: previousCount,
      changePercentage,
      isSpiking,
      sentimentBreakdown,
    };
  });

  return summaries.sort((a, b) => b.totalFeedbackCount - a.totalFeedbackCount);
}
