"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", feedback: 120 },
  { day: "Tue", feedback: 180 },
  { day: "Wed", feedback: 150 },
  { day: "Thu", feedback: 220 },
  { day: "Fri", feedback: 190 },
  { day: "Sat", feedback: 260 },
  { day: "Sun", feedback: 230 },
];

export default function FeedbackChart() {
  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">
        Feedback Trend
      </h3>

      <p className="mb-6 text-sm text-gray-500">
        Feedback received over the last 7 days
      </p>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="feedback"
              stroke="currentColor"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}