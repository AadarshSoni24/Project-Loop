"use client";

import Link from "next/link";
import { useState } from "react";

const channels = [
  {
    name: "App Store",
    description: "Customer reviews from the App Store.",
    count: 2,
    status: "Connected",
  },
  {
    name: "Email",
    description: "Feedback received through email.",
    count: 1,
    status: "Connected",
  },
  {
    name: "Website",
    description: "Feedback submitted through your website.",
    count: 1,
    status: "Connected",
  },
  {
    name: "Google Reviews",
    description: "Customer reviews from Google.",
    count: 0,
    status: "Not Connected",
  },
];

export default function ChannelsPage() {
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleSimulate = (channelName: string) => {
    setActiveChannel(channelName);
    setMessage("");

    setTimeout(() => {
      setActiveChannel(null);
      setMessage(`${channelName} ingestion completed successfully.`);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">

      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href="/inbox"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Inbox
        </Link>

        {/* Header */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold">
            Channels
          </h1>

          <p className="mt-2 text-gray-600">
            Manage the sources from which LOOP receives customer feedback.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-700">
              {message}
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Channels
            </p>

            <p className="mt-2 text-3xl font-bold">
              {channels.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Connected
            </p>

            <p className="mt-2 text-3xl font-bold">
              {channels.filter(
                (channel) => channel.status === "Connected"
              ).length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Feedback Items
            </p>

            <p className="mt-2 text-3xl font-bold">
              {channels.reduce(
                (total, channel) => total + channel.count,
                0
              )}
            </p>
          </div>

        </div>

        {/* Channel Cards */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">

          {channels.map((channel) => {
            const isActive = activeChannel === channel.name;

            return (
              <div
                key={channel.name}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h2 className="text-xl font-semibold">
                      {channel.name}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {channel.description}
                    </p>
                  </div>

                  <span
                    className={
                      channel.status === "Connected"
                        ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                        : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                    }
                  >
                    {channel.status}
                  </span>

                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5">

                  <div>
                    <p className="text-sm text-gray-500">
                      Feedback
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      {channel.count}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulate(channel.name)}
                    disabled={isActive}
                    className="rounded-lg bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isActive
                      ? "Pulling..."
                      : "Pull Feedback"}
                  </button>

                </div>

              </div>
            );
          })}

        </div>

        {/* Integration Information */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Channel Integration
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Channel buttons currently simulate feedback ingestion for the
            frontend demo. Real App Store, email, website, and Google Reviews
            integrations will be connected through the backend/API later.
          </p>

        </div>

      </div>

    </main>
  );
}