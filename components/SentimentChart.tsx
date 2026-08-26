"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SentimentChartProps {
  positive?: number;
  neutral?: number;
  negative?: number;
}

const COLORS = ["#10b981", "#64748b", "#ef4444"];

export default function SentimentChart({
  positive = 68,
  neutral = 13,
  negative = 19,
}: SentimentChartProps) {
  const data = [
    { name: "Positive", value: positive },
    { name: "Neutral", value: neutral },
    { name: "Negative", value: negative },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Sentiment Overview
          </h3>
          <p className="text-xs text-gray-500">
            Current distribution across sentiment categories
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: number) => [`${val}%`, "Share"]}
              contentStyle={{
                backgroundColor: "#1e293b",
                borderRadius: "8px",
                color: "#fff",
                border: "none",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-xs text-gray-700 font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
