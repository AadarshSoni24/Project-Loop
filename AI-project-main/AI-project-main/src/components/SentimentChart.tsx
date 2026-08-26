"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Positive", value: 68 },
  { name: "Negative", value: 19 },
  { name: "Neutral", value: 13 },
];

const COLORS = ["#22c55e", "#ef4444", "#9ca3af"];

export default function SentimentChart() {
  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">
        Sentiment Overview
      </h3>

      <p className="mb-6 text-sm text-gray-500">
        Overall customer sentiment
      </p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}