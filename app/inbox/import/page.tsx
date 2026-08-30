"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

interface PreviewRow {
  content: string;
  channel: string;
  customer_label?: string;
}

interface ImportResult {
  totalRows: number;
  importedCount: number;
  failedCount: number;
}

export default function ImportFeedbackPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setError("");
    setResult(null);
    setPreviewRows([]);

    if (!selected) {
      setFile(null);
      return;
    }

    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a valid .csv file.");
      setFile(null);
      return;
    }

    setFile(selected);

    try {
      const text = await selected.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

      if (lines.length < 2) {
        setError("CSV must contain a header and at least one data row.");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ""));
      const contentIdx = headers.indexOf("content");

      if (contentIdx === -1) {
        setError("CSV header must contain a 'content' column.");
        return;
      }

      const rows: PreviewRow[] = [];
      for (let i = 1; i < Math.min(lines.length, 6); i++) {
        const cells = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cells[contentIdx]) {
          rows.push({
            content: cells[contentIdx],
            channel: headers.indexOf("channel") !== -1 ? cells[headers.indexOf("channel")] : "csv_upload",
            customer_label: headers.indexOf("customer_label") !== -1 ? cells[headers.indexOf("customer_label")] : undefined,
          });
        }
      }
      setPreviewRows(rows);
    } catch (err) {
      setError("Failed to read file.");
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const text = await file.text();

      const res = await fetch("/api/feedback/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Failed to process bulk import.");
      } else {
        setResult(data.summary);
      }
    } catch (err) {
      setError("An unexpected error occurred during import.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Import Feedback (Bulk CSV)"
          subtitle="Upload customer feedback datasets for automated AI classification and vector indexing."
        />

        <div className="max-w-3xl">
          <Link
            href="/inbox"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition"
          >
            ← Back to Inbox
          </Link>

          {/* Success Result Box */}
          {result && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">
                  ✓
                </span>
                <h3 className="text-sm font-bold text-green-900">
                  Bulk CSV Import & AI Indexing Complete!
                </h3>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3 text-xs bg-white/80 p-3.5 rounded-lg border border-green-100">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-gray-400">Total Rows</span>
                  <p className="font-bold text-gray-900 text-sm">{result.totalRows}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-gray-400">Successfully Imported</span>
                  <p className="font-bold text-green-700 text-sm">{result.importedCount}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-gray-400">Failed / Skipped</span>
                  <p className="font-bold text-gray-700 text-sm">{result.failedCount}</p>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href="/inbox"
                  className="rounded-lg bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800 transition inline-block"
                >
                  Go to Feedback Inbox →
                </Link>
              </div>
            </div>
          )}

          {/* Upload Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Select CSV Dataset File
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Ensure your file includes a header with <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-bold">content</code>, optional <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">channel</code>, and <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">customer_label</code> columns.
              </p>
            </div>

            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 cursor-pointer"
              />
              <p className="text-[11px] text-gray-400 mt-2">
                Supported format: UTF-8 CSV
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            {/* Preview Rows Table */}
            {previewRows.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Preview (First {previewRows.length} Rows)
                </h4>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-[10px] uppercase font-semibold text-gray-500 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2">Content</th>
                        <th className="px-3 py-2">Channel</th>
                        <th className="px-3 py-2">Customer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {previewRows.map((r, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 text-gray-800 max-w-xs truncate">{r.content}</td>
                          <td className="px-3 py-2 text-gray-500 capitalize">{r.channel || "csv_upload"}</td>
                          <td className="px-3 py-2 text-gray-500">{r.customer_label || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleImport}
              disabled={!file || loading}
              className="w-full rounded-lg bg-gray-900 py-3 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-40 transition shadow-sm"
            >
              {loading ? "Processing Batch with AI..." : "Upload & Classify All Records"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
