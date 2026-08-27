"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function NewReportPage() {
  const router = useRouter();
  const [periodDays, setPeriodDays] = useState("30");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodDays: parseInt(periodDays, 10) }),
      });

      const data = await res.json();

      if (res.ok && data.id) {
        router.push(`/reports/${data.id}`);
      } else {
        setError(data.message || data.error || "Failed to generate report.");
        setGenerating(false);
      }
    } catch (err) {
      setError("An unexpected error occurred while generating report.");
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Generate Voice-of-Customer Report"
          subtitle="Synthesize raw feedback datasets into structured executive summaries and recommended actions."
        />

        <div className="max-w-2xl">
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition"
          >
            ← Back to Reports
          </Link>

          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
            <div>
              <label
                htmlFor="period"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Reporting Time Horizon
              </label>
              <select
                id="period"
                value={periodDays}
                onChange={(e) => setPeriodDays(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-xs font-semibold text-gray-900 outline-none focus:border-gray-900"
              >
                <option value="7">Last 7 Days (Weekly Digest)</option>
                <option value="14">Last 14 Days (Bi-Weekly Review)</option>
                <option value="30">Last 30 Days (Monthly Executive VoC)</option>
                <option value="90">Last 90 Days (Quarterly Strategy Review)</option>
              </select>
            </div>

            {/* Scope Summary Preview */}
            <div className="rounded-xl bg-gray-50 p-5 border border-gray-100 text-xs">
              <h4 className="font-bold text-gray-900 mb-2">
                Executive Digest Sections Included:
              </h4>
              <ul className="space-y-1.5 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> AI Executive Synthesis & Narrative
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Period Volume & Sentiment Breakdown
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Top Theme Clusters & Velocity Deltas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Representative Customer Quotes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Derived Recommended Action Items
                </li>
              </ul>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full rounded-lg bg-gray-900 py-3.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition shadow-sm"
            >
              {generating
                ? "Synthesizing VoC Report with AI..."
                : "Generate Executive VoC Report →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
