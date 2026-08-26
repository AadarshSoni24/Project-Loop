"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FeedbackChartProps {
  data?: { day: string; feedback: number }[];
}

const DEFAULT_DATA = [
  { day: "Mon", feedback: 12 },
  { day: "Tue", feedback: 18 },
  { day: "Wed", feedback: 15 },
  { day: "Thu", feedback: 22 },
  { day: "Fri", feedback: 19 },
  { day: "Sat", feedback: 26 },
  { day: "Sun", feedback: 23 },
];

export default function FeedbackChart({ data = DEFAULT_DATA }: FeedbackChartProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Feedback Volume Trend
          </h3>
          <p className="text-xs text-gray-500">
            Incoming customer feedback over recent period
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700">
          Live
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFeedback" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#111827" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#111827" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderRadius: "8px",
                color: "#fff",
                border: "none",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#38bdf8" }}
            />
            <Area
              type="monotone"
              dataKey="feedback"
              stroke="#111827"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorFeedback)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
