"use client";

import Link from "next/link";
import { useState } from "react";

export default function NewFeedbackPage() {
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("Website");
  const [rating, setRating] = useState("5");
  const [sentiment, setSentiment] = useState("Positive");
  const [theme, setTheme] = useState("General");
  const [status, setStatus] = useState("NEW");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-3xl">

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
            Add Feedback
          </h1>

          <p className="mt-2 text-gray-600">
            Add a new customer feedback item to your workspace.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >

          {/* Customer */}
          <div>
            <label
              htmlFor="customer"
              className="mb-2 block text-sm font-medium"
            >
              Customer
            </label>

            <input
              id="customer"
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Customer name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Email */}
          <div className="mt-6">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Customer Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Feedback */}
          <div className="mt-6">
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium"
            >
              Feedback
            </label>

            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter customer feedback..."
              required
              rows={6}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Channel */}
          <div className="mt-6">
            <label
              htmlFor="channel"
              className="mb-2 block text-sm font-medium"
            >
              Channel
            </label>

            <select
              id="channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
            >
              <option>Website</option>
              <option>App Store</option>
              <option>Email</option>
              <option>Google Reviews</option>
              <option>Other</option>
            </select>
          </div>

          {/* Rating + Sentiment */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">

            <div>
              <label
                htmlFor="rating"
                className="mb-2 block text-sm font-medium"
              >
                Rating
              </label>

              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none"
              >
                <option value="5">5 ⭐</option>
                <option value="4">4 ⭐</option>
                <option value="3">3 ⭐</option>
                <option value="2">2 ⭐</option>
                <option value="1">1 ⭐</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sentiment"
                className="mb-2 block text-sm font-medium"
              >
                Sentiment
              </label>

              <select
                id="sentiment"
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none"
              >
                <option>Positive</option>
                <option>Negative</option>
                <option>Neutral</option>
              </select>
            </div>

          </div>

          {/* Theme + Status */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">

            <div>
              <label
                htmlFor="theme"
                className="mb-2 block text-sm font-medium"
              >
                Theme
              </label>

              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none"
              >
                <option>General</option>
                <option>Customer Support</option>
                <option>Delivery</option>
                <option>Service Quality</option>
                <option>Customer Experience</option>
                <option>Product</option>
                <option>Pricing</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none"
              >
                <option>NEW</option>
                <option>REVIEWED</option>
                <option>ACTIONED</option>
              </select>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Add Feedback
            </button>

            <Link
              href="/inbox"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            {saved && (
              <span className="text-sm font-medium text-green-700">
                Feedback added successfully.
              </span>
            )}

          </div>

        </form>
      </div>
    </main>
  );
}