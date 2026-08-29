"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import FeedbackChart from "@/components/FeedbackChart";
import SentimentChart from "@/components/SentimentChart";
import ThemeBarChart from "@/components/ThemeBarChart";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex">
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
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
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
          <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Feedback
              </p>
              <div className="p-2 rounded-lg bg-gray-50 text-gray-700">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              {totalCount.toLocaleString()}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Analyzed in workspace
            </p>
          </div>

          {/* Positive Sentiment */}
          <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Positive Sentiment
              </p>
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="mt-2 text-3xl font-bold text-green-600">
              {positivePercent}%
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {stats?.sentiment?.positiveCount ?? 49} feedback entries
            </p>
          </div>

          {/* Negative Sentiment */}
          <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Negative / Friction
              </p>
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="mt-2 text-3xl font-bold text-red-600">
              {negativePercent}%
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {stats?.sentiment?.negativeCount ?? 48} entries needing action
            </p>
          </div>

          {/* Satisfaction Score */}
          <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Satisfaction Rating
              </p>
              <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
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
          <div>
            <ThemeBarChart />
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
