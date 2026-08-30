import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { sessionUser, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const url = new URL(req.url);
    const channel = url.searchParams.get("channel");
    const sentiment = url.searchParams.get("sentiment");
    const status = url.searchParams.get("status");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // Build dynamic filter
    const where: Record<string, unknown> = {
      workspaceId: sessionUser.workspaceId,
    };

    if (channel) where.channel = channel;
    if (sentiment) where.sentiment = sentiment;
    if (status) where.status = status;

    if (startDate || endDate) {
      const createdAtFilter: Record<string, Date> = {};
      if (startDate) createdAtFilter.gte = new Date(startDate);
      if (endDate) createdAtFilter.lte = new Date(endDate);
      where.createdAt = createdAtFilter;
    }

    const feedbackItems = await db.feedback.findMany({
      where,
      orderBy: { createdAt: "asc" },
      include: {
        themes: {
          include: { theme: true },
        },
      },
    });

    const totalCount = feedbackItems.length;
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    let totalScore = 0;

    const dayMap: { [key: string]: number } = {};
    const themeCountMap: { [key: string]: number } = {};

    feedbackItems.forEach((f) => {
      if (f.sentiment === "POS") positiveCount++;
      else if (f.sentiment === "NEU") neutralCount++;
      else if (f.sentiment === "NEG") negativeCount++;

      totalScore += f.sentimentScore;

      // Group by day of week
      const dayName = new Date(f.createdAt).toLocaleDateString("en-US", { weekday: "short" });
      dayMap[dayName] = (dayMap[dayName] || 0) + 1;

      // Group by theme
      f.themes.forEach((ft) => {
        const tName = ft.theme.name;
        themeCountMap[tName] = (themeCountMap[tName] || 0) + 1;
      });
    });

    const positivePercent = totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0;
    const neutralPercent = totalCount > 0 ? Math.round((neutralCount / totalCount) * 100) : 0;
    const negativePercent = totalCount > 0 ? Math.round((negativeCount / totalCount) * 100) : 0;

    // Convert sentiment score (-1 to 1) to a 1-5 star scale: (score + 1) * 2 + 1
    const avgScore = totalCount > 0 ? totalScore / totalCount : 0;
    const avgRating = Math.round(((avgScore + 1) * 2 + 1) * 10) / 10;

    const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dailyTrend = daysOrder.map((day) => ({
      day,
      feedback: dayMap[day] || 0,
    }));

    const themeBreakdown = Object.entries(themeCountMap)
      .map(([theme, feedback]) => ({ theme, feedback }))
      .sort((a, b) => b.feedback - a.feedback)
      .slice(0, 6);

    return NextResponse.json({
      totalCount,
      sentiment: {
        positiveCount,
        neutralCount,
        negativeCount,
        positivePercent,
        neutralPercent,
        negativePercent,
      },
      avgRating,
      dailyTrend,
      themeBreakdown,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Analytics Error", message: (err as Error).message },
      { status: 500 }
    );
  }
}
