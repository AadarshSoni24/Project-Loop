"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch(`/api/reports/${id}`);
        if (res.ok) {
          const data = await res.json();
          setReport(data);
        } else {
          setError("Failed to load report or access denied.");
        }
      } catch (err) {
        setError("An error occurred while loading the report.");
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="print:hidden">
        <Sidebar />
      </div>

      <main className="ml-64 flex-1 p-8 print:ml-0 print:p-4">
        <div className="print:hidden">
          <Navbar
            title="Voice-of-Customer Digest"
            subtitle="Executive intelligence summary generated from customer feedback."
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 print:hidden">
            <Link
              href="/reports"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
            >
              ← Back to All Reports
            </Link>

            <button
              onClick={() => window.print()}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition shadow-xs"
            >
              🖨️ Export / Print PDF
            </button>
          </div>

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-xs text-gray-400">
              Loading report digest...
            </div>
          ) : error || !report ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-red-700">{error || "Report not found."}</p>
              <Link href="/reports" className="mt-3 inline-block text-xs font-semibold text-gray-900 underline">
                Return to reports list
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Report Header Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    Voice-of-Customer Executive Digest
                  </span>
                  <span className="text-xs text-gray-400">
                    Generated: {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h1 className="text-2xl font-extrabold text-gray-900 mt-4">
                  {report.title}
                </h1>

                <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-4">
                  <span>
                    Reporting Period:{" "}
                    <strong className="text-gray-800">
                      {new Date(report.periodStart).toLocaleDateString()} –{" "}
                      {new Date(report.periodEnd).toLocaleDateString()}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Report ID: <code className="text-gray-700 font-mono">{report.id}</code>
                  </span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
                  Executive Summary
                </h3>
                <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {report.content?.summary || "No executive summary available."}
                </div>
              </div>

              {/* Sentiment & Volume Snapshot */}
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                  Period Volume & Sentiment Breakdown
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                    <span className="text-[10px] font-semibold uppercase text-gray-500">
                      Total Volume
                    </span>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {report.content?.periodStats?.totalVolume || 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-green-50/70 p-4 border border-green-100">
                    <span className="text-[10px] font-semibold uppercase text-green-700">
                      Positive Items
                    </span>
                    <p className="text-2xl font-bold text-green-800 mt-1">
                      {report.content?.periodStats?.positiveCount || 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                    <span className="text-[10px] font-semibold uppercase text-gray-600">
                      Neutral Items
                    </span>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {report.content?.periodStats?.neutralCount || 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-red-50/70 p-4 border border-red-100">
                    <span className="text-[10px] font-semibold uppercase text-red-700">
                      Negative Friction
                    </span>
                    <p className="text-2xl font-bold text-red-800 mt-1">
                      {report.content?.periodStats?.negativeCount || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Themes */}
              {report.content?.topThemes && report.content.topThemes.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                    Top Feedback Themes & Surges
                  </h3>

                  <div className="divide-y divide-gray-100 text-xs">
                    {report.content.topThemes.map((theme: any, idx: number) => (
                      <div key={idx} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{theme.name}</span>
                          {theme.isSpiking && (
                            <span className="rounded bg-red-100 px-2 py-0.2 text-[10px] font-bold text-red-700">
                              🔥 Surge
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500 font-medium">{theme.count} feedback items</span>
                          <span className="text-green-600 font-bold">
                            {theme.changePercentage > 0 ? `+${theme.changePercentage}%` : `${theme.changePercentage}%`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notable Verbatim Quotes */}
              {report.content?.notableQuotes && report.content.notableQuotes.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                    Verbatim Customer Quotes
                  </h3>

                  <div className="space-y-3 text-xs">
                    {report.content.notableQuotes.map((q: any, idx: number) => (
                      <div key={idx} className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                        <p className="text-gray-800 italic">&ldquo;{q.content}&rdquo;</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                          <span className="capitalize">Channel: {q.channel.replace("_", " ")}</span>
                          <span className={`font-bold ${q.sentiment === "POS" ? "text-green-600" : "text-red-600"}`}>
                            {q.sentiment === "POS" ? "Positive" : "Negative"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              {report.content?.recommendedActions && report.content.recommendedActions.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                    Recommended Action Plan
                  </h3>

                  <ol className="space-y-2.5 text-xs text-gray-800 list-decimal list-inside">
                    {report.content.recommendedActions.map((action: string, idx: number) => (
                      <li key={idx} className="leading-relaxed font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {action}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
