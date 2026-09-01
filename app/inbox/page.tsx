"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

interface FeedbackThemeItem {
  theme: { id: string; name: string };
}

interface FeedbackItem {
  id: string;
  content: string;
  channel: string;
  sentiment: string;
  sentimentScore: number;
  status: string;
  createdAt: string;
  themes?: FeedbackThemeItem[];
}

interface ThemeOption {
  themeId: string;
  themeName: string;
}

export default function InboxPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  const [themeId, setThemeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [themeOptions, setThemeOptions] = useState<ThemeOption[]>([]);

  // Load theme options for the filter dropdown (with cache)
  useEffect(() => {
    async function loadThemes() {
      try {
        // Check cache first
        const cacheKey = "loop_inbox_themes";
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < 120_000) {
            setThemeOptions(data);
          }
        }

        const res = await fetch("/api/themes?days=365");
        if (res.ok) {
          const data = await res.json();
          const opts = (data.data || []).map((t: { themeId: string; themeName: string }) => ({
            themeId: t.themeId,
            themeName: t.themeName,
          }));
          setThemeOptions(opts);
          sessionStorage.setItem(cacheKey, JSON.stringify({ data: opts, ts: Date.now() }));
        }
      } catch (err) {
        console.error("Failed to load theme options:", err);
      }
    }
    loadThemes();
  }, []);

  // Read themeId from URL search params on initial load (for drill-down from Trends)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlThemeId = urlParams.get("themeId");
      if (urlThemeId) {
        setThemeId(urlThemeId);
      }
    }
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "15");
      if (search.trim()) params.set("search", search.trim());
      if (sentiment) params.set("sentiment", sentiment);
      if (channel) params.set("channel", channel);
      if (status) params.set("status", status);
      if (themeId) params.set("themeId", themeId);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const res = await fetch(`/api/feedback?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFeedback(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sentiment, channel, status, themeId, startDate, endDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchFeedback();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const prevItem = feedback.find((item) => item.id === id);
    const previousStatus = prevItem?.status;

    // Optimistic update - immediate visual feedback
    setFeedback((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok && previousStatus) {
        // Revert on error
        setFeedback((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: previousStatus } : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      if (previousStatus) {
        setFeedback((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: previousStatus } : item
          )
        );
      }
    }
  };

  const clearFilters = () => {
    setSentiment("");
    setChannel("");
    setStatus("");
    setThemeId("");
    setStartDate("");
    setEndDate("");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = sentiment || channel || status || themeId || startDate || endDate || search;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Feedback Inbox"
          subtitle="View, search, filter, and organize customer feedback."
        />

        {/* Action Header */}
        <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/inbox/new"
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition shadow-sm"
            >
              + Add Feedback
            </Link>
            <Link
              href="/inbox/import"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition shadow-xs"
            >
              Import CSV
            </Link>
            <Link
              href="/inbox/channels"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition shadow-xs"
            >
              Channels &amp; Ingest
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-red-600 hover:text-red-800 transition"
              >
                Clear All Filters
              </button>
            )}
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-900">{feedback.length}</span> of{" "}
              <span className="font-semibold text-gray-900">{totalCount}</span> records
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          <form onSubmit={handleSearchSubmit} className="lg:col-span-2 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search feedback text..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gray-800"
            >
              Search
            </button>
          </form>

          {/* Sentiment Filter */}
          <select
            value={sentiment}
            onChange={(e) => {
              setSentiment(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-900"
          >
            <option value="">All Sentiments</option>
            <option value="POS">Positive</option>
            <option value="NEU">Neutral</option>
            <option value="NEG">Negative</option>
          </select>

          {/* Channel Filter */}
          <select
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-900"
          >
            <option value="">All Channels</option>
            <option value="support_ticket">Support Ticket</option>
            <option value="app_store">App Store</option>
            <option value="nps_survey">NPS Survey</option>
            <option value="sales_call">Sales Call</option>
            <option value="community_post">Community Post</option>
            <option value="csv_upload">CSV Upload</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-900"
          >
            <option value="">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="REVIEWED">REVIEWED</option>
            <option value="ACTIONED">ACTIONED</option>
          </select>

          {/* Theme Filter */}
          <select
            value={themeId}
            onChange={(e) => {
              setThemeId(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-900"
          >
            <option value="">All Themes</option>
            {themeOptions.map((t) => (
              <option key={t.themeId} value={t.themeId}>
                {t.themeName}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filters */}
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              To
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Feedback Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3.5">Content &amp; Themes</th>
                  <th className="px-6 py-3.5">Channel</th>
                  <th className="px-6 py-3.5">Sentiment</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Loading feedback records...
                    </td>
                  </tr>
                ) : feedback.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      No feedback matched your filters.
                    </td>
                  </tr>
                ) : (
                  feedback.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-6 py-4 max-w-md">
                        <Link
                          href={`/inbox/${item.id}`}
                          className="font-medium text-gray-900 hover:underline line-clamp-2"
                        >
                          {item.content}
                        </Link>
                        {item.themes && item.themes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.themes.map((ft: FeedbackThemeItem) => (
                              <span
                                key={ft.theme.id}
                                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700"
                              >
                                {ft.theme.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-600 font-medium">
                        {item.channel.replace("_", " ")}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.sentiment === "POS"
                              ? "bg-green-100 text-green-700"
                              : item.sentiment === "NEG"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.sentiment} ({item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore})
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`rounded px-2 py-1 text-[11px] font-semibold border ${
                            item.status === "NEW"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : item.status === "REVIEWED"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="REVIEWED">REVIEWED</option>
                          <option value="ACTIONED">ACTIONED</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/inbox/${item.id}`}
                          className="rounded border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-100 transition shadow-xs"
                        >
                          Inspect →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              ← Previous
            </button>

            <span className="text-xs text-gray-500 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              Next →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
