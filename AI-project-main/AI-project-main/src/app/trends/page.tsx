"use client";

import { useState } from "react";

const themes = [
  {
    name: "Customer Support",
    count: 42,
    change: "+18%",
    spike: true,
    data: [12, 18, 16, 25, 30, 38, 42],
  },
  {
    name: "Delivery",
    count: 35,
    change: "+9%",
    spike: false,
    data: [20, 22, 24, 21, 28, 31, 35],
  },
  {
    name: "Service Quality",
    count: 28,
    change: "-4%",
    spike: false,
    data: [30, 28, 27, 29, 26, 25, 28],
  },
  {
    name: "Customer Experience",
    count: 21,
    change: "+14%",
    spike: true,
    data: [10, 12, 14, 13, 16, 19, 21],
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TrendsPage() {
  const [selectedTheme, setSelectedTheme] = useState(
    themes[0].name
  );

  const selected = themes.find(
    (theme) => theme.name === selectedTheme
  );

  const totalFeedback = themes.reduce(
    (total, theme) => total + theme.count,
    0
  );

  const spikeCount = themes.filter(
    (theme) => theme.spike
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Trends
          </h1>

          <p className="mt-2 text-gray-600">
            Explore feedback themes, volume and emerging spikes.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Tracked Feedback
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalFeedback}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Across tracked themes
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Active Themes
            </p>

            <p className="mt-2 text-3xl font-bold">
              {themes.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Currently monitored
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Spikes Detected
            </p>

            <p className="mt-2 text-3xl font-bold">
              {spikeCount}
            </p>

            <p className="mt-1 text-sm text-red-600">
              Needs attention
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Top Theme
            </p>

            <p className="mt-2 text-xl font-bold">
              Customer Support
            </p>

            <p className="mt-1 text-sm text-green-600">
              +18% growth
            </p>
          </div>

        </div>

        {/* Theme Cards */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          {themes.map((theme) => (
            <button
              key={theme.name}
              type="button"
              onClick={() => setSelectedTheme(theme.name)}
              className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:shadow-md ${
                selectedTheme === theme.name
                  ? "border-gray-900 ring-2 ring-gray-200"
                  : "border-gray-200"
              }`}
            >

              <div className="flex items-start justify-between gap-3">

                <h2 className="font-semibold">
                  {theme.name}
                </h2>

                {theme.spike && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                    Spike
                  </span>
                )}

              </div>

              <p className="mt-4 text-3xl font-bold">
                {theme.count}
              </p>

              <p
                className={`mt-1 text-sm font-medium ${
                  theme.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {theme.change} vs previous period
              </p>

            </button>
          ))}

        </div>

        {/* Selected Theme */}
        {selected && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Selected Theme
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {selected.name}
                </h2>
              </div>

              <a
                href={`/inbox?theme=${encodeURIComponent(
                  selected.name
                )}`}
                className="rounded-lg bg-gray-900 px-5 py-3 text-center font-medium text-white hover:bg-gray-800"
              >
                View Feedback
              </a>

            </div>

            {/* Chart */}
            <div className="mt-8">

              <div className="flex h-72 items-end gap-3 border-b border-l border-gray-200 px-4 pb-0 pt-6">

                {selected.data.map((value, index) => (
                  <div
                    key={days[index]}
                    className="flex h-full flex-1 flex-col items-center justify-end"
                  >

                    <span className="mb-2 text-xs text-gray-500">
                      {value}
                    </span>

                    <div
                      className="w-full max-w-[56px] rounded-t-md bg-gray-800 transition hover:bg-gray-600"
                      style={{
                        height: `${value * 5}px`,
                      }}
                    />

                  </div>
                ))}

              </div>

              <div className="mt-3 grid grid-cols-7 text-center text-xs text-gray-500">
                {days.map((day) => (
                  <span key={day}>
                    {day}
                  </span>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* Theme Summary */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Theme Summary
          </h2>

          <div className="mt-5 overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Theme
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Feedback
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Change
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {themes.map((theme) => (
                  <tr
                    key={theme.name}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                  >

                    <td className="px-5 py-4 font-medium">
                      {theme.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {theme.count}
                    </td>

                    <td
                      className={`px-5 py-4 font-medium ${
                        theme.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {theme.change}
                    </td>

                    <td className="px-5 py-4">

                      {theme.spike ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                          Spike detected
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                          Normal
                        </span>
                      )}

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* Insight */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Trend Insight
          </h2>

          <p className="mt-2 leading-7 text-gray-600">
            Customer Support currently has the highest feedback volume
            and an 18% increase compared with the previous period.
            Customer Experience is also showing a notable increase,
            while Service Quality is trending slightly downward.
          </p>

        </div>

      </div>

    </main>
  );
}