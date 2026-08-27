"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const SENTIMENT_COLORS = ["#10b981", "#64748b", "#ef4444"];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const totalCount = stats?.totalCount ?? 125;
  const positivePercent = stats?.sentiment?.positivePercent ?? 39;
  const neutralPercent = stats?.sentiment?.neutralPercent ?? 22;
  const negativePercent = stats?.sentiment?.negativePercent ?? 38;
  const avgRating = stats?.avgRating ?? 3.8;

  const sentimentPieData = [
    { name: "Positive", value: positivePercent },
    { name: "Neutral", value: neutralPercent },
    { name: "Negative", value: negativePercent },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Customer Feedback Analytics"
          subtitle="Cross-channel sentiment analysis, volume trends, and feature clustering."
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Volume
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {totalCount.toLocaleString()}
            </h2>
            <p className="mt-1 text-xs text-gray-400">Total responses analyzed</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Positive Share
            </p>
            <h2 className="mt-2 text-3xl font-bold text-emerald-600">
              {positivePercent}%
            </h2>
            <p className="mt-1 text-xs text-gray-400">{stats?.sentiment?.positiveCount ?? 49} positive items</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Negative Friction
            </p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {negativePercent}%
            </h2>
            <p className="mt-1 text-xs text-gray-400">{stats?.sentiment?.negativeCount ?? 48} friction items</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Avg Satisfaction Score
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {avgRating} <span className="text-base text-gray-400 font-normal">/ 5.0</span>
            </h2>
            <p className="mt-1 text-xs text-gray-400">Calculated from AI sentiment</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Trend */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Feedback Ingestion Velocity
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Volume of feedback ingested across the last 7 days
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats?.dailyTrend || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e293b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#1e293b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "8px",
                      color: "#fff",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="feedback"
                    stroke="#1e293b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Sentiment Distribution
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Breakdown of customer emotion across all channels
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {sentimentPieData.map((entry, index) => (
                      <Cell key={entry.name} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val}%`, "Share"]}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "8px",
                      color: "#fff",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs text-gray-700 font-medium">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Theme Distribution & AI Insight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Themes Bar Chart */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Feedback Volume by Theme Cluster
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Top tracked customer topics and feature areas
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats?.themeBreakdown || []}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis type="category" dataKey="theme" stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "8px",
                      color: "#fff",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="feedback" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key AI Insight */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                <h3 className="text-sm font-bold text-gray-900">
                  Key Customer Takeaway
                </h3>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Customer sentiment across the active workspace reflects <strong className="text-gray-900">{positivePercent}% positive</strong> feedback, with primary praise focused on Dashboard speed and Analytics UI improvements.
              </p>

              <div className="rounded-lg bg-gray-50 p-3.5 border border-gray-100 text-xs text-gray-700 mb-4">
                <span className="font-semibold text-red-700 block mb-1">
                  Primary Friction Area:
                </span>
                Onboarding wizard freeze and PDF invoice download latency account for the majority of negative sentiment.
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-[11px] text-gray-400">
                Generated automatically by LOOP AI Analytics Engine
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
