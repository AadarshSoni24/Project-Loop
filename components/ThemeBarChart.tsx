"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface ThemeBarChartProps {
  data?: { theme: string; count: number }[];
}

const DEFAULT_DATA = [
  { theme: "Onboarding", count: 12 },
  { theme: "Billing", count: 8 },
  { theme: "Performance", count: 15 },
  { theme: "UI/UX", count: 10 },
  { theme: "Mobile", count: 6 },
];

export default function ThemeBarChart({ data = DEFAULT_DATA }: ThemeBarChartProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Top Themes</h3>
          <p className="text-xs text-gray-500">Most frequent feedback themes</p>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="theme" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderRadius: "8px",
                color: "#fff",
                border: "none",
                fontSize: "12px",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
            <Bar dataKey="count" fill="#111827" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
