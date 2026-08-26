"use client";

import { useParams } from "next/navigation";

export default function ReportDetailPage() {
  const params = useParams();

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <a
          href="/reports"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Reports
        </a>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Voice of Customer Report
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Weekly Customer Feedback Report
            </h1>

            <p className="mt-2 text-gray-600">
              Aug 18, 2026 – Aug 24, 2026
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-800 hover:bg-gray-50"
          >
            Export / Print
          </button>
        </div>

        {/* Report ID */}
        <p className="mt-4 text-xs text-gray-400">
          Report ID: {params.id}
        </p>

        {/* Executive Summary */}
        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Executive Summary
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Customer feedback remains generally positive, with strong
            appreciation for service quality and support. The main areas
            requiring attention are delivery delays and response times.
          </p>
        </section>

        {/* Sentiment */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Sentiment Overview
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            <div className="rounded-lg bg-green-50 p-5">
              <p className="text-sm text-green-700">
                Positive
              </p>

              <p className="mt-2 text-3xl font-bold text-green-800">
                68%
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-5">
              <p className="text-sm text-red-700">
                Negative
              </p>

              <p className="mt-2 text-3xl font-bold text-red-800">
                19%
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-5">
              <p className="text-sm text-gray-600">
                Neutral
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-800">
                13%
              </p>
            </div>

          </div>
        </section>

        {/* Top Themes */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Top Themes
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="font-medium">
                  Customer Support
                </p>
                <p className="text-sm text-gray-500">
                  42 feedback items
                </p>
              </div>

              <span className="font-semibold">
                34%
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="font-medium">
                  Delivery
                </p>
                <p className="text-sm text-gray-500">
                  35 feedback items
                </p>
              </div>

              <span className="font-semibold">
                28%
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="font-medium">
                  Service Quality
                </p>
                <p className="text-sm text-gray-500">
                  28 feedback items
                </p>
              </div>

              <span className="font-semibold">
                22%
              </span>
            </div>

          </div>
        </section>

        {/* Sentiment Shifts */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Sentiment Shifts
          </h2>

          <div className="mt-4 rounded-lg bg-gray-50 p-5">
            <p className="text-gray-700">
              Negative feedback increased by{" "}
              <span className="font-semibold">
                9%
              </span>{" "}
              compared with the previous period, primarily due to
              delivery-related complaints.
            </p>
          </div>
        </section>

        {/* Customer Quotes */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Verbatim Customer Quotes
          </h2>

          <div className="mt-5 space-y-4">

            <blockquote className="border-l-4 border-gray-300 pl-4">
              <p className="italic text-gray-700">
                "Great service and very helpful support."
              </p>

              <footer className="mt-2 text-sm text-gray-500">
                Rahul · App Store
              </footer>
            </blockquote>

            <blockquote className="border-l-4 border-gray-300 pl-4">
              <p className="italic text-gray-700">
                "Delivery was late and I had to wait."
              </p>

              <footer className="mt-2 text-sm text-gray-500">
                Priya · Email
              </footer>
            </blockquote>

            <blockquote className="border-l-4 border-gray-300 pl-4">
              <p className="italic text-gray-700">
                "Amazing experience. I will recommend you."
              </p>

              <footer className="mt-2 text-sm text-gray-500">
                Neha · App Store
              </footer>
            </blockquote>

          </div>
        </section>

        {/* Recommended Actions */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Recommended Actions
          </h2>

          <ol className="mt-5 space-y-4">

            <li className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium">
                1. Investigate delivery delays
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Review delivery operations and identify the main causes
                of late orders.
              </p>
            </li>

            <li className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium">
                2. Improve support response times
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Identify opportunities to reduce customer waiting time.
              </p>
            </li>

            <li className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium">
                3. Continue strong customer support
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Maintain the support practices that are generating
                positive customer feedback.
              </p>
            </li>

          </ol>
        </section>

      </div>
    </main>
  );
}