"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function FeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("NEW");
  const [updating, setUpdating] = useState(false);
  const [reclassifying, setReclassifying] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadItem() {
      try {
        const res = await fetch(`/api/feedback/${id}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data);
          setStatus(data.status);
        } else {
          setMessage({ text: "Feedback not found or access denied.", type: "error" });
        }
      } catch (err) {
        console.error("Failed to load feedback item:", err);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  const handleSaveStatus = async () => {
    const prevStatus = item?.status;
    setItem((prev: any) => ({ ...prev, status }));
    setUpdating(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updated = await res.json();
        setItem((prev: any) => ({ ...prev, status: updated.status }));
        setMessage({ text: "Status updated successfully.", type: "success" });
      } else {
        if (prevStatus) setItem((prev: any) => ({ ...prev, status: prevStatus }));
        setMessage({ text: "Failed to update status.", type: "error" });
      }
    } catch (err) {
      if (prevStatus) setItem((prev: any) => ({ ...prev, status: prevStatus }));
      setMessage({ text: "Error saving status.", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const handleReclassify = async () => {
    setReclassifying(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reclassify" }),
      });

      if (res.ok) {
        const result = await res.json();
        setItem((prev: any) => ({
          ...prev,
          sentiment: result.data.sentiment,
          sentimentScore: result.data.sentimentScore,
          featureArea: result.data.featureArea,
        }));
        setMessage({
          text: `Re-classification complete! Detected: ${result.data.sentiment} (${result.data.sentimentScore}) • Feature: ${result.data.featureArea}`,
          type: "success",
        });
      } else {
        setMessage({ text: "Re-classification failed.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error re-classifying item.", type: "error" });
    } finally {
      setReclassifying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this feedback item?")) return;

    try {
      const res = await fetch(`/api/feedback/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/inbox");
      } else {
        setMessage({ text: "Failed to delete feedback.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error deleting item.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Feedback Detail"
          subtitle={`Inspect & manage feedback record #${id.slice(0, 8)}`}
        />

        <div className="max-w-4xl">
          {/* Back link */}
          <Link
            href="/inbox"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition"
          >
            ← Back to Inbox
          </Link>

          {message && (
            <div
              className={`mb-6 rounded-xl border p-4 text-xs font-semibold ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-xs text-gray-400">
              Loading feedback record...
            </div>
          ) : !item ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-gray-800">Feedback not found.</p>
              <Link href="/inbox" className="mt-3 inline-block text-xs font-semibold text-gray-900 underline">
                Return to inbox
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Content Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        item.sentiment === "POS"
                          ? "bg-green-100 text-green-700"
                          : item.sentiment === "NEG"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.sentiment === "POS"
                        ? "POSITIVE"
                        : item.sentiment === "NEG"
                        ? "NEGATIVE"
                        : "NEUTRAL"}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      Score: {item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400">
                    Created: {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Customer Feedback Content
                  </p>
                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-100 text-sm text-gray-800 leading-relaxed">
                    &ldquo;{item.content}&rdquo;
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100 text-xs">
                  <div>
                    <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                      Channel
                    </span>
                    <p className="font-semibold text-gray-800 capitalize mt-0.5">
                      {item.channel.replace("_", " ")}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                      Customer Label
                    </span>
                    <p className="font-semibold text-gray-800 mt-0.5">
                      {item.customerLabel || "Anonymous"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                      Feature Area
                    </span>
                    <p className="font-semibold text-gray-800 mt-0.5">
                      {item.featureArea || "General"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                      Vector Embeddings
                    </span>
                    <p className="font-semibold text-emerald-700 mt-0.5">
                      {item.embedding ? "64-dim Attached" : "None"}
                    </p>
                  </div>
                </div>

                {/* Themes List */}
                {item.themes && item.themes.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Clustered Themes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.themes.map((ft: any) => (
                        <span
                          key={ft.theme.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200"
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: ft.theme.color || "#3b82f6" }}
                          />
                          {ft.theme.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Update Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Workflow Status Management
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-900 outline-none focus:border-gray-900"
                  >
                    <option value="NEW">NEW</option>
                    <option value="REVIEWED">REVIEWED</option>
                    <option value="ACTIONED">ACTIONED</option>
                  </select>

                  <button
                    onClick={handleSaveStatus}
                    disabled={updating}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition"
                  >
                    {updating ? "Saving..." : "Save Status"}
                  </button>

                  <button
                    onClick={handleDelete}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition ml-auto"
                  >
                    Delete Record
                  </button>
                </div>
              </div>

              {/* AI Auto-Classifier Engine Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      AI Feedback Intelligence Engine
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Re-run AI sentiment scoring, theme mapping, and feature categorization.
                    </p>
                  </div>

                  <button
                    onClick={handleReclassify}
                    disabled={reclassifying}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-100 disabled:opacity-50 transition shadow-xs"
                  >
                    {reclassifying ? "Classifying..." : "Re-classify Feedback"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
