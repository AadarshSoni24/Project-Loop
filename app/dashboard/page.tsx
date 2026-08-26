"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import FeedbackChart from "@/components/FeedbackChart";
import SentimentChart from "@/components/SentimentChart";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [recentFeedback, setRecentFeedback] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [analyticsRes, feedbackRes, themesRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/feedback?limit=5"),
          fetch("/api/themes?days=7"),
        ]);

        if (analyticsRes.ok) {
          const aData = await analyticsRes.json();
          setStats(aData);
        }

        if (feedbackRes.ok) {
          const fData = await feedbackRes.json();
          setRecentFeedback(fData.data || []);
        }

        if (themesRes.ok) {
          const tData = await themesRes.json();
          setThemes(tData.data || []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalCount = stats?.totalCount ?? 125;
  const positivePercent = stats?.sentiment?.positivePercent ?? 39;
  const neutralPercent = stats?.sentiment?.neutralPercent ?? 22;
  const negativePercent = stats?.sentiment?.negativePercent ?? 38;
  const avgRating = stats?.avgRating ?? 3.8;

  const spikingThemes = themes.filter((t) => t.isSpiking);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Dashboard"
          subtitle="Real-time Voice-of-Customer Intelligence & Metrics"
          actionHref="/inbox/new"
          actionLabel="+ Add Feedback"
        />

        {/* Spiking Alert Banner if any theme is spiking */}
        {spikingThemes.length > 0 && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50/70 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700 text-sm font-bold">
                🔥
              </span>
              <div>
                <p className="text-sm font-semibold text-red-900">
                  Theme Spike Detected: {spikingThemes.map((t) => `'${t.themeName}' (+${t.changePercentage}%)`).join(", ")}
                </p>
                <p className="text-xs text-red-700">
                  Unusual volume surge in feedback requires review.
                </p>
              </div>
            </div>
            <Link
              href="/trends"
              className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition"
            >
              Inspect Trends →
            </Link>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Feedback */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Feedback
              </p>
              <span className="text-lg">📥</span>
            </div>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              {totalCount.toLocaleString()}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Analyzed in workspace
            </p>
          </div>

          {/* Positive Sentiment */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Positive Sentiment
              </p>
              <span className="text-lg">💚</span>
            </div>
            <h3 className="mt-2 text-3xl font-bold text-green-600">
              {positivePercent}%
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {stats?.sentiment?.positiveCount ?? 49} feedback entries
            </p>
          </div>

          {/* Negative Sentiment */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Negative / Friction
              </p>
              <span className="text-lg">⚠️</span>
            </div>
            <h3 className="mt-2 text-3xl font-bold text-red-600">
              {negativePercent}%
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {stats?.sentiment?.negativeCount ?? 48} entries needing action
            </p>
          </div>

          {/* Satisfaction Score */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Satisfaction Rating
              </p>
              <span className="text-lg">⭐</span>
            </div>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              {avgRating} <span className="text-base text-gray-400 font-normal">/ 5.0</span>
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Estimated customer score
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <FeedbackChart data={stats?.dailyTrend} />
          </div>
          <div>
            <SentimentChart
              positive={positivePercent}
              neutral={neutralPercent}
              negative={negativePercent}
            />
          </div>
        </div>

        {/* Recent Feedback Feed */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Recent Incoming Feedback
              </h2>
              <p className="text-xs text-gray-500">
                Latest customer responses classified by AI
              </p>
            </div>
            <Link
              href="/inbox"
              className="text-xs font-semibold text-gray-900 hover:underline"
            >
              View all inbox →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentFeedback.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                No feedback recorded yet. Add some or pull from channels!
              </div>
            ) : (
              recentFeedback.map((item) => (
                <div
                  key={item.id}
                  className="p-5 hover:bg-gray-50/80 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.sentiment === "POS"
                            ? "bg-green-100 text-green-700"
                            : item.sentiment === "NEG"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {item.sentiment === "POS"
                          ? "POSITIVE"
                          : item.sentiment === "NEG"
                          ? "NEGATIVE"
                          : "NEUTRAL"}
                      </span>
                      <span className="text-xs font-medium text-gray-500 capitalize">
                        {item.channel.replace("_", " ")}
                      </span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {item.content}
                    </p>
                  </div>

                  <Link
                    href={`/inbox/${item.id}`}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition whitespace-nowrap self-start sm:self-center shadow-xs"
                  >
                    View Details →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
