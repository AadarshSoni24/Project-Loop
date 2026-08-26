"use client";

import { useState } from "react";

const feedbackData = [
  {
    id: 1,
    customer: "Rahul",
    feedback: "Great service and very helpful support.",
    sentiment: "Positive",
    rating: 5,
  },
  {
    id: 2,
    customer: "Priya",
    feedback: "Delivery was late and I had to wait.",
    sentiment: "Negative",
    rating: 2,
  },
  {
    id: 3,
    customer: "Amit",
    feedback: "Service was okay, nothing special.",
    sentiment: "Neutral",
    rating: 3,
  },
  {
    id: 4,
    customer: "Neha",
    feedback: "Amazing experience. I will recommend you.",
    sentiment: "Positive",
    rating: 5,
  },
];

export default function FeedbackPage() {
  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState("All Sentiments");

  const filteredFeedback = feedbackData.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.customer.toLowerCase().includes(searchText) ||
      item.feedback.toLowerCase().includes(searchText);

    const matchesSentiment =
      sentiment === "All Sentiments" ||
      item.sentiment === sentiment;

    return matchesSearch && matchesSentiment;
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Feedback
        </h1>

        <p className="mt-2 text-gray-600">
          View and analyze customer feedback
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mt-8 flex gap-4">

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer or feedback..."
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
        />

        <select
          value={sentiment}
          onChange={(e) => setSentiment(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
        >
          <option>All Sentiments</option>
          <option>Positive</option>
          <option>Negative</option>
          <option>Neutral</option>
        </select>

      </div>

      {/* Feedback Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b border-gray-200 bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  Feedback
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  Sentiment
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  Rating
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredFeedback.map((item) => (

                <tr
                  key={item.id}
                  className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                >

                  <td className="px-6 py-5 font-medium text-gray-900">
                    {item.customer}
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {item.feedback}
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

                </tr>

              ))}

            </tbody>

          </table>

          {/* No Results */}
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