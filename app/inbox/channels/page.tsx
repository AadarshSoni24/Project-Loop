"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

interface ChannelItem {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  status: string;
  lastSync: string;
}

const CHANNELS: (Omit<ChannelItem, 'icon'> & { iconType: string })[] = [
  {
    id: "support_ticket",
    name: "Zendesk & Freshdesk",
    type: "Support Tickets",
    description: "Inbound customer support tickets, escalations, and resolved queries.",
    iconType: "ticket",
    status: "Active",
    lastSync: "Just now",
  },
  {
    id: "app_store",
    name: "App Store & Google Play",
    type: "Mobile App Reviews",
    description: "Star ratings, crash feedback, and user reviews from mobile app stores.",
    iconType: "mobile",
    status: "Active",
    lastSync: "5 mins ago",
  },
  {
    id: "nps_survey",
    name: "CSAT & NPS Surveys",
    type: "Post-Onboarding Surveys",
    description: "Quarterly NPS campaigns, post-purchase CSAT ratings, and feedback forms.",
    iconType: "survey",
    status: "Active",
    lastSync: "12 mins ago",
  },
  {
    id: "sales_call",
    name: "Gong & CRM Sales Notes",
    type: "Sales Call Transcripts",
    description: "Enterprise feature requests, prospect objections, and competitive intel.",
    iconType: "sales",
    status: "Active",
    lastSync: "1 hour ago",
  },
  {
    id: "community_post",
    name: "Discord & Slack Community",
    type: "Community Forum",
    description: "User sentiment from developer communities, feature requests, and bugs.",
    iconType: "community",
    status: "Active",
    lastSync: "2 hours ago",
  },
];

export default function ChannelsPage() {
  const [ingesting, setIngesting] = useState<string | null>(null);
  const [ingestedFeedback, setIngestedFeedback] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleSimulate = async (channelId: string) => {
    setIngesting(channelId);
    setMessage(null);

    try {
      const res = await fetch("/api/feedback/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: channelId }),
      });

      if (res.ok) {
        const item = await res.json();
        setIngestedFeedback((prev) => [item, ...prev]);
        setMessage(
          `Successfully ingested new feedback via '${item.channel.replace("_", " ").toUpperCase()}'! AI detected: ${item.sentiment} (${item.sentimentScore}).`
        );
      } else {
        setMessage("Failed to simulate channel ingestion.");
      }
    } catch (err) {
      setMessage("Error calling ingestion endpoint.");
    } finally {
      setIngesting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Feedback Ingestion Channels"
          subtitle="Manage active customer feedback pipelines & simulate live data streams."
        />

        <div className="max-w-5xl">
          <Link
            href="/inbox"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition"
          >
            ← Back to Inbox
          </Link>

          {message && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-xs font-semibold text-green-800 shadow-xs flex items-center justify-between">
              <span>{message}</span>
              <Link href="/inbox" className="underline font-bold">
                View in Inbox →
              </Link>
            </div>
          )}

          {/* Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CHANNELS.map((ch) => {
              const isSyncing = ingesting === ch.id;

              return (
                <div
                  key={ch.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 leading-tight">
                            {ch.name}
                          </h3>
                          <p className="text-[11px] font-medium text-gray-400">
                            {ch.type}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        {ch.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed mt-2 mb-4">
                      {ch.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      Sync: {ch.lastSync}
                    </span>

                    <button
                      onClick={() => handleSimulate(ch.id)}
                      disabled={isSyncing}
                      className="rounded-lg bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition shadow-xs"
                    >
                      {isSyncing ? "Pulling Stream..." : "Pull Live Feedback"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ingested Stream Card */}
          {ingestedFeedback.length > 0 && (
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Live Ingested Feedback Feed
              </h3>
              <div className="divide-y divide-gray-100 text-xs">
                {ingestedFeedback.map((fb) => (
                  <div key={fb.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="font-semibold text-gray-900 capitalize mr-2">
                        [{fb.channel.replace("_", " ")}]
                      </span>
                      <span className="text-gray-700">{fb.content}</span>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${
                        fb.sentiment === "POS"
                          ? "bg-green-100 text-green-700"
                          : fb.sentiment === "NEG"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {fb.sentiment}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
