"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function NewFeedbackPage() {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("support_ticket");
  const [customerLabel, setCustomerLabel] = useState("");
  const [sourceRef, setSourceRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdItem, setCreatedItem] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreatedItem(null);

    if (!content.trim() || content.trim().length < 3) {
      setError("Feedback content must be at least 3 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          channel,
          customerLabel: customerLabel.trim() || undefined,
          sourceRef: sourceRef.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Failed to create feedback.");
        setLoading(false);
        return;
      }

      setCreatedItem(data);
      setContent("");
      setCustomerLabel("");
      setSourceRef("");
    } catch (err) {
      setError("An unexpected error occurred while saving feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Add Customer Feedback"
          subtitle="Submit raw customer feedback to trigger real-time AI classification."
        />

        <div className="max-w-3xl">
          <Link
            href="/inbox"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition"
          >
            ← Back to Inbox
          </Link>

          {/* Success Banner with AI Classification Details */}
          {createdItem && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">
                  ✓
                </span>
                <h3 className="text-sm font-bold text-green-900">
                  Feedback Successfully Ingested & AI Classified!
                </h3>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/80 p-3 rounded-lg border border-green-100">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-gray-400">Sentiment</span>
                  <p className="font-bold text-gray-900">{createdItem.sentiment} ({createdItem.sentimentScore})</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-gray-400">Feature Area</span>
                  <p className="font-bold text-gray-900">{createdItem.featureArea || "General"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-gray-400">Themes Assigned</span>
                  <p className="font-bold text-gray-900">
                    {createdItem.themes?.map((t: any) => t.theme.name).join(", ") || "None"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-gray-400">RAG Vector</span>
                  <p className="font-bold text-green-700">64-dim Generated</p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Link
                  href={`/inbox/${createdItem.id}`}
                  className="rounded-lg bg-green-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-green-800 transition"
                >
                  View Ingested Record →
                </Link>
                <Link
                  href="/inbox"
                  className="rounded-lg border border-green-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-green-800 hover:bg-green-50 transition"
                >
                  Go to Inbox
                </Link>
              </div>
            </div>
          )}

          {/* Input Form Card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5"
          >
            {/* Feedback Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
              >
                Feedback Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter customer quote, ticket transcript, or review text..."
                className="w-full rounded-lg border border-gray-300 bg-white p-3.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition"
              />
            </div>

            {/* Channel & Customer Label Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="channel"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
                >
                  Channel Source
                </label>
                <select
                  id="channel"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900"
                >
                  <option value="support_ticket">Support Ticket (Zendesk / Freshdesk)</option>
                  <option value="app_store">App Store Review (iOS / Android)</option>
                  <option value="nps_survey">NPS / CSAT Survey</option>
                  <option value="sales_call">Sales Call Note (Gong / CRM)</option>
                  <option value="community_post">Community Post (Discord / Forum)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="customerLabel"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
                >
                  Customer Identifier / Tier (Optional)
                </label>
                <input
                  id="customerLabel"
                  type="text"
                  value={customerLabel}
                  onChange={(e) => setCustomerLabel(e.target.value)}
                  placeholder="e.g. Enterprise Client #402, Rahul"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900"
                />
              </div>
            </div>

            {/* Source Reference */}
            <div>
              <label
                htmlFor="sourceRef"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
              >
                External Reference ID (Optional)
              </label>
              <input
                id="sourceRef"
                type="text"
                value={sourceRef}
                onChange={(e) => setSourceRef(e.target.value)}
                placeholder="e.g. TICKET-9821, REVIEW-301"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            {/* Submit Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition shadow-sm"
              >
                {loading ? "Classifying with AI..." : "Submit & Auto-Classify Feedback"}
              </button>
              <Link
                href="/inbox"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
