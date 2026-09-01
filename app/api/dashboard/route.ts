import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { getThemeTrends } from "@/lib/ai/clustering";

/**
 * Combined dashboard endpoint — returns analytics, recent feedback, AND theme trends
 * in a SINGLE API call instead of 3 separate ones.
 */
export async function GET(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const workspaceId = sessionUser.workspaceId;

    const where = { workspaceId };

    // Run ALL queries in parallel — single network roundtrip to DB
    const [
      totalCount,
      sentimentCounts,
      themeGroupData,
      recentFeedback,
      themeTrends,
    ] = await Promise.all([
      db.feedback.count({ where }),

      db.feedback.groupBy({
        by: ["sentiment"],
        where,
        _count: { id: true },
        _avg: { sentimentScore: true },
      }),

      db.feedbackTheme.groupBy({
        by: ["themeId"],
        where: { feedback: where },
        _count: { feedbackId: true },
        orderBy: { _count: { feedbackId: "desc" } },
        take: 6,
      }),

      db.feedback.findMany({
        where,
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          themes: {
            include: { theme: true },
          },
        },
      }),

      getThemeTrends(workspaceId, 7),
    ]);

    // Parse sentiment
    let positiveCount = 0, neutralCount = 0, negativeCount = 0;
    let totalWeightedScore = 0, totalScoreEntries = 0;

    sentimentCounts.forEach((g) => {
      const count = g._count.id;
      const avgScore = g._avg.sentimentScore ?? 0;
      if (g.sentiment === "POS") positiveCount = count;
      else if (g.sentiment === "NEU") neutralCount = count;
      else if (g.sentiment === "NEG") negativeCount = count;
      totalWeightedScore += avgScore * count;
      totalScoreEntries += count;
    });

    const positivePercent = totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0;
    const neutralPercent = totalCount > 0 ? Math.round((neutralCount / totalCount) * 100) : 0;
    const negativePercent = totalCount > 0 ? Math.round((negativeCount / totalCount) * 100) : 0;
    const avgScore = totalScoreEntries > 0 ? totalWeightedScore / totalScoreEntries : 0;
    const avgRating = Math.round(((avgScore + 1) * 2 + 1) * 10) / 10;

    // Daily trend
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const trendData = await db.feedback.findMany({
      where: { ...where, createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    });

    const dayMap: Record<string, number> = {};
    trendData.forEach((f) => {
      const dayName = new Date(f.createdAt).toLocaleDateString("en-US", { weekday: "short" });
      dayMap[dayName] = (dayMap[dayName] || 0) + 1;
    });

    const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dailyTrend = daysOrder.map((day) => ({ day, feedback: dayMap[day] || 0 }));

    // Resolve theme names
    let themeBreakdown: { theme: string; feedback: number }[] = [];
    if (themeGroupData.length > 0) {
      const themeIds = themeGroupData.map((t) => t.themeId);
      const themeNames = await db.theme.findMany({
        where: { id: { in: themeIds } },
        select: { id: true, name: true },
      });
      const nameMap = Object.fromEntries(themeNames.map((t) => [t.id, t.name]));
      themeBreakdown = themeGroupData.map((t) => ({
        theme: nameMap[t.themeId] || "Unknown",
        feedback: t._count.feedbackId,
      }));
    }

    const response = NextResponse.json({
      analytics: {
        totalCount,
        sentiment: { positiveCount, neutralCount, negativeCount, positivePercent, neutralPercent, negativePercent },
        avgRating,
        dailyTrend,
        themeBreakdown,
      },
      recentFeedback,
      themeTrends,
    });

    response.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=60");
    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Dashboard Error", message: (err as Error).message },
      { status: 500 }
    );
  }
}
