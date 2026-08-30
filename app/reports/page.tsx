"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

interface ReportSummary {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  content?: {
    periodStats?: { totalVolume?: number };
  };
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Voice-of-Customer (VoC) Reports"
          subtitle="AI synthesized executive digests, sentiment shifts, and recommended actions."
          actionHref="/reports/new"
          actionLabel="+ Generate VoC Report"
        />

        <div className="max-w-5xl">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-6">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                Generated Executive Reports ({reports.length})
              </h3>
              <Link
                href="/reports/new"
                className="text-xs font-semibold text-gray-900 hover:underline"
              >
                + New Report
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-12 text-center text-xs text-gray-400">
                  Loading VoC reports...
                </div>
              ) : reports.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm font-semibold text-gray-800">
                    No VoC reports generated yet.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Generate an executive digest based on workspace customer feedback.
                  </p>
                  <Link
                    href="/reports/new"
                    className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition"
                  >
                    Generate First Report →
                  </Link>
                </div>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-6 hover:bg-gray-50/80 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-gray-900">
                        {report.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span>
                          Period:{" "}
                          <strong className="text-gray-700">
                            {new Date(report.periodStart).toLocaleDateString()} –{" "}
                            {new Date(report.periodEnd).toLocaleDateString()}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Generated:{" "}
                          <strong className="text-gray-700">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </strong>
                        </span>
                        <span>•</span>
                        <span className="capitalize">
                          Volume:{" "}
                          <strong className="text-gray-700">
                            {report.content?.periodStats?.totalVolume ?? "N/A"} items
                          </strong>
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/reports/${report.id}`}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-100 transition whitespace-nowrap shadow-xs"
                    >
                      Open Digest →
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
