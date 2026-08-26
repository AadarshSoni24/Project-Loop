"use client";

import Link from "next/link";
import { useState } from "react";

type Feedback = {
  id: number;
  customer: string;
  feedback: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  rating: number;
  status: "NEW" | "REVIEWED" | "ACTIONED";
  channel: "App Store" | "Email" | "Website";
  date: string;
};

const feedbackData: Feedback[] = [
  {
    id: 1,
    customer: "Rahul",
    feedback: "Great service and very helpful support.",
    sentiment: "Positive",
    rating: 5,
    status: "NEW",
    channel: "App Store",
    date: "2026-08-20",
  },
  {
    id: 2,
    customer: "Priya",
    feedback: "Delivery was late and I had to wait.",
    sentiment: "Negative",
    rating: 2,
    status: "REVIEWED",
    channel: "Email",
    date: "2026-08-19",
  },
  {
    id: 3,
    customer: "Amit",
    feedback: "Service was okay, nothing special.",
    sentiment: "Neutral",
    rating: 3,
    status: "ACTIONED",
    channel: "Website",
    date: "2026-08-18",
  },
  {
    id: 4,
    customer: "Neha",
    feedback: "Amazing experience. I will recommend you.",
    sentiment: "Positive",
    rating: 5,
    status: "NEW",
    channel: "App Store",
    date: "2026-08-21",
  },
];

export default function InboxPage() {
  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState("All Sentiments");
  const [channel, setChannel] = useState("All Channels");
  const [status, setStatus] = useState("All Statuses");
  const [date, setDate] = useState("");

  const filteredFeedback = feedbackData.filter((item) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      item.customer.toLowerCase().includes(searchText) ||
      item.feedback.toLowerCase().includes(searchText);

    const matchesSentiment =
      sentiment === "All Sentiments" ||
      item.sentiment === sentiment;

    const matchesChannel =
      channel === "All Channels" ||
      item.channel === channel;

    const matchesStatus =
      status === "All Statuses" ||
      item.status === status;

    const matchesDate =
      date === "" || item.date === date;

    return (
      matchesSearch &&
      matchesSentiment &&
      matchesChannel &&
      matchesStatus &&
      matchesDate
    );
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Inbox
        </h1>

        <p className="mt-2 text-gray-600">
          View and manage customer feedback
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">

          <Link
            href="/inbox/new"
            className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            + Add Feedback
          </Link>

          <Link
            href="/inbox/import"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-800 hover:bg-gray-50"
          >
            Import CSV
          </Link>

          <Link
            href="/inbox/channels"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-800 hover:bg-gray-50"
          >
            Channels
          </Link>

        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-4">

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer or feedback..."
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
        />

        <select
          value={sentiment}
          onChange={(e) => setSentiment(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none"
        >
          <option>All Sentiments</option>
          <option>Positive</option>
          <option>Negative</option>
          <option>Neutral</option>
        </select>

        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none"
        >
          <option>All Channels</option>
          <option>App Store</option>
          <option>Email</option>
          <option>Website</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none"
        >
          <option>All Statuses</option>
          <option>NEW</option>
          <option>REVIEWED</option>
          <option>ACTIONED</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none"
        />

      </div>

      {/* Results */}
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredFeedback.length}
            </span>{" "}
            feedback item
            {filteredFeedback.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b border-gray-200">
              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Feedback
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Channel
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Sentiment
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Rating
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Date
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredFeedback.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                >

                  <td className="px-6 py-5 font-medium">
                    <Link
                      href={`/inbox/${item.id}`}
                      className="hover:underline"
                    >
                      {item.customer}
                    </Link>
                  </td>

                  <td className="max-w-md px-6 py-5 text-gray-700">
                    {item.feedback}
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {item.channel}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={
                        item.sentiment === "Positive"
                          ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                          : item.sentiment === "Negative"
                          ? "rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                          : "rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700"
                      }
                    >
                      {item.sentiment}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-lg">
                    {"⭐".repeat(item.rating)}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={
                        item.status === "NEW"
                          ? "rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                          : item.status === "REVIEWED"
                          ? "rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700"
                          : "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                      }
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {item.date}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          {filteredFeedback.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No feedback found.
            </div>
          )}

        </div>
      </div>

    </main>
  );
}