"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function TrendsPage() {
  const [themes, setThemes] = useState<any[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadThemes() {
      try {
        const res = await fetch("/api/themes?days=7");
        if (res.ok) {
          const data = await res.json();
          const items = data.data || [];
          setThemes(items);
          if (items.length > 0) {
            setSelectedTheme(items[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load themes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadThemes();
  }, []);

  const totalTracked = themes.reduce((acc, t) => acc + t.totalFeedbackCount, 0);
  const spikingThemes = themes.filter((t) => t.isSpiking);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Theme Trends & Spike Detection"
          subtitle="Real-time feedback clustering, weekly growth rates, and automated surge alerts."
        />

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tracked Feedback
            </p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              {totalTracked}
            </h3>
            <p className="mt-1 text-xs text-gray-400">Across all theme clusters</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Active Themes
            </p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              {themes.length}
            </h3>
            <p className="mt-1 text-xs text-gray-400">Monitored in workspace</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Spikes Detected
            </p>
            <h3 className={`mt-2 text-3xl font-bold ${spikingThemes.length > 0 ? "text-red-600" : "text-gray-900"}`}>
              {spikingThemes.length}
            </h3>
            <p className="mt-1 text-xs text-red-600 font-medium">
              {spikingThemes.length > 0 ? "Surge in volume (> +30%)" : "Normal velocity"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Top Theme
            </p>
            <h3 className="mt-2 text-lg font-bold text-gray-900 truncate">
              {themes[0]?.themeName || "Team Onboarding"}
            </h3>
            <p className="mt-1 text-xs text-green-600 font-medium">
              +{themes[0]?.changePercentage || 0}% change
            </p>
          </div>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {themes.map((theme) => {
            const isSelected = selectedTheme?.themeId === theme.themeId;

            return (
              <button
                key={theme.themeId}
                type="button"
                onClick={() => setSelectedTheme(theme)}
                className={`rounded-xl border p-5 text-left transition-all shadow-xs ${
                  isSelected
                    ? "border-gray-900 bg-white ring-2 ring-gray-900"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: theme.color || "#3b82f6" }}
                    />
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {theme.themeName}
                    </h4>
                  </div>

                  {theme.isSpiking && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 uppercase tracking-wide">
                      Spike
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <p className="text-2xl font-extrabold text-gray-900">
                    {theme.totalFeedbackCount}
                  </p>
                  <span
                    className={`text-xs font-bold ${
                      theme.changePercentage > 0 ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {theme.changePercentage > 0 ? `+${theme.changePercentage}%` : `${theme.changePercentage}%`}
                  </span>
                </div>

                <p className="text-[10px] text-gray-400 mt-1">vs previous 7-day period</p>
              </button>
            );
          })}
        </div>

        {/* Selected Theme Deep-Dive */}
        {selectedTheme && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: selectedTheme.color || "#3b82f6" }}
                  />
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedTheme.themeName}
                  </h3>
                  {selectedTheme.isSpiking && (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 uppercase tracking-wide">
                      Spike Alert
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recorded {selectedTheme.totalFeedbackCount} feedback items in workspace.
                </p>
              </div>

              <Link
                href={`/inbox?themeId=${selectedTheme.themeId}`}
                className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition"
              >
                Inspect Feedback in Inbox →
              </Link>
            </div>

            {/* Sentiment Breakdown for Selected Theme */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-green-50/70 p-4 border border-green-100">
                <span className="text-[10px] font-semibold uppercase text-green-700">
                  Positive Feedback
                </span>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {selectedTheme.sentimentBreakdown?.POS || 0}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                <span className="text-[10px] font-semibold uppercase text-gray-600">
                  Neutral Feedback
                </span>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {selectedTheme.sentimentBreakdown?.NEU || 0}
                </p>
              </div>

              <div className="rounded-lg bg-red-50/70 p-4 border border-red-100">
                <span className="text-[10px] font-semibold uppercase text-red-700">
                  Negative / Friction
                </span>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  {selectedTheme.sentimentBreakdown?.NEG || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Theme Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Complete Theme Trend Summary
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/50 text-[10px] uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-3">Theme Name</th>
                  <th className="px-6 py-3">Total Volume</th>
                  <th className="px-6 py-3">7-Day Change</th>
                  <th className="px-6 py-3">Surge Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {themes.map((t) => (
                  <tr key={t.themeId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3.5 font-bold text-gray-900 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color || "#3b82f6" }} />
                      {t.themeName}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-gray-900">{t.totalFeedbackCount}</td>
                    <td className="px-6 py-3.5 font-semibold text-green-600">
                      {t.changePercentage > 0 ? `+${t.changePercentage}%` : `${t.changePercentage}%`}
                    </td>
                    <td className="px-6 py-3.5">
                      {t.isSpiking ? (
                        <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          Spike Alert
                        </span>
                      ) : (
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedTheme(t)}
                        className="text-xs font-semibold text-gray-900 hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
