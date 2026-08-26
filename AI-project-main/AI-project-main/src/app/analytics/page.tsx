"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const sentimentData = [
  { name: "Positive", value: 68 },
  { name: "Negative", value: 19 },
  { name: "Neutral", value: 13 },
];

const monthlyData = [
  { month: "Jan", feedback: 180 },
  { month: "Feb", feedback: 220 },
  { month: "Mar", feedback: 195 },
  { month: "Apr", feedback: 260 },
  { month: "May", feedback: 310 },
  { month: "Jun", feedback: 280 },
];

const themeData = [
  { theme: "Support", feedback: 320 },
  { theme: "Delivery", feedback: 240 },
  { theme: "Quality", feedback: 210 },
  { theme: "Product", feedback: 180 },
  { theme: "Pricing", feedback: 140 },
];

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>

        <p className="mt-2 text-gray-600">
          Analyze customer feedback, sentiment, and themes.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Feedback
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            1,248
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Positive
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            68%
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Negative
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            19%
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Average Rating
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            4.2 ⭐
          </h2>
        </div>

      </div>

      {/* Main Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* Feedback Trend */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold">
            Feedback Trend
          </h2>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="feedback"
                  fill="#374151"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* Sentiment */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold">
            Sentiment Distribution
          </h2>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >

                  {sentimentData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        index === 0
                          ? "#16a34a"
                          : index === 1
                          ? "#dc2626"
                          : "#6b7280"
                      }
                    />
                  ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* Theme Analysis */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">
          Feedback by Theme
        </h2>

        <div className="h-80">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={themeData}
              layout="vertical"
              margin={{
                left: 20,
                right: 20,
              }}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey="theme"
                width={80}
              />

              <Tooltip />

              <Bar
                dataKey="feedback"
                fill="#4b5563"
                radius={[0, 6, 6, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* Insight */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold">
          Key Insight
        </h2>

        <p className="mt-3 leading-7 text-gray-600">
          Customer sentiment is currently mostly positive, with 68% of
          feedback classified as positive. Customer Support is the largest
          feedback theme, making it an important area to monitor.
        </p>

      </div>

    </main>
  );
}