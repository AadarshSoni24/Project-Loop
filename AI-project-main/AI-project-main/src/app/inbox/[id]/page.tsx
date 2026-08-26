"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const feedbackData = [
  {
    id: 1,
    customer: "Rahul",
    theme: "Customer Support",
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
    theme: "Delivery",
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
    theme: "Service Quality",
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
    theme: "Customer Experience",
    feedback: "Amazing experience. I will recommend you.",
    sentiment: "Positive",
    rating: 5,
    status: "NEW",
    channel: "App Store",
    date: "2026-08-21",
  },
];

export default function FeedbackDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const item = feedbackData.find(
    (feedback) => feedback.id === id
  );

  const [status, setStatus] = useState(
    item?.status || "NEW"
  );

  const [sentiment, setSentiment] = useState(
    item?.sentiment || "Neutral"
  );

  const [saved, setSaved] = useState(false);

  if (!item) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold">
            Feedback Not Found
          </h1>

          <p className="mt-2 text-gray-600">
            The feedback item you are looking for does not exist.
          </p>

          <Link
            href="/inbox"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            ← Back to Inbox
          </Link>
        </div>
      </main>
    );
  }

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">

      <div className="mx-auto max-w-4xl">

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
            Feedback Details
          </h1>

          <p className="mt-2 text-gray-600">
            Review and manage this customer feedback.
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          {/* Customer */}
          <div>
            <p className="text-sm font-medium text-gray-500">
              Customer
            </p>

            <p className="mt-1 text-lg font-semibold">
              {item.customer}
            </p>
          </div>

          {/* Feedback */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-500">
              Feedback
            </p>

            <div className="mt-2 rounded-lg bg-gray-50 p-4 text-gray-800">
              {item.feedback}
            </div>
          </div>

          {/* Information */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Theme
              </p>

              <p className="mt-1 font-medium">
                {item.theme}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Channel
              </p>

              <p className="mt-1 font-medium">
                {item.channel}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Date
              </p>

              <p className="mt-1 font-medium">
                {item.date}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Rating
              </p>

              <p className="mt-1 text-lg">
                {"⭐".repeat(item.rating)}
              </p>
            </div>

          </div>

          {/* Sentiment */}
          <div className="mt-8 border-t border-gray-200 pt-6">

            <label
              htmlFor="sentiment"
              className="block text-sm font-medium text-gray-500"
            >
              Sentiment
            </label>

            <select
              id="sentiment"
              value={sentiment}
              onChange={(e) => {
                setSentiment(e.target.value);
                setSaved(false);
              }}
              className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            >
              <option value="Positive">
                Positive
              </option>

              <option value="Negative">
                Negative
              </option>

              <option value="Neutral">
                Neutral
              </option>
            </select>

          </div>

          {/* Status */}
          <div className="mt-6">

            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-500"
            >
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setSaved(false);
              }}
              className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            >
              <option value="NEW">
                NEW
              </option>

              <option value="REVIEWED">
                REVIEWED
              </option>

              <option value="ACTIONED">
                ACTIONED
              </option>
            </select>

          </div>

          {/* Save */}
          <div className="mt-8 flex items-center gap-4 border-t border-gray-200 pt-6">

            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Save Changes
            </button>

            {saved && (
              <span className="text-sm font-medium text-green-700">
                Changes saved.
              </span>
            )}

          </div>

        </div>

        {/* AI / Re-classification */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Feedback Intelligence
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            LOOP can analyze this feedback and suggest a sentiment,
            theme, and recommended action.
          </p>

          <button
            type="button"
            onClick={() =>
              alert(
                "AI re-classification will be connected to the backend later."
              )
            }
            className="mt-5 rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-800 hover:bg-gray-50"
          >
            Re-classify Feedback
          </button>

        </div>

      </div>

    </main>
  );
}