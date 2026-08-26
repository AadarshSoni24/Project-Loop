"use client";

import { useState } from "react";

export default function NewReportPage() {
  const [startDate, setStartDate] = useState("2026-08-18");
  const [endDate, setEndDate] = useState("2026-08-24");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);

    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <a
          href="/reports"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Reports
        </a>

        {/* Header */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold">
            Generate VoC Report
          </h1>

          <p className="mt-2 text-gray-600">
            Select a reporting period and generate a Voice-of-Customer
            report.
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

          <div className="grid gap-6 md:grid-cols-2">

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-semibold text-gray-800"
              >
                Start Date
              </label>

              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setGenerated(false);
                }}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-semibold text-gray-800"
              >
                End Date
              </label>

              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setGenerated(false);
                }}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

          </div>

          {/* Report Preview */}
          <div className="mt-8 rounded-lg bg-gray-50 p-5">

            <h2 className="font-semibold">
              Report will include
            </h2>

            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>• Top feedback themes</li>
              <li>• Sentiment distribution and changes</li>
              <li>• Representative customer quotes</li>
              <li>• Recommended actions</li>
            </ul>

          </div>

          {/* Generate */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="mt-8 w-full rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? "Generating Report..." : "Generate Report"}
          </button>

          {/* Loading */}
          {generating && (
            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              LOOP is analyzing the selected feedback and preparing the
              report narrative...
            </div>
          )}

          {/* Success */}
          {generated && !generating && (
            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-5">

              <h2 className="font-semibold text-green-800">
                Report generated successfully
              </h2>

              <p className="mt-2 text-sm text-green-700">
                Your Voice-of-Customer report is ready to view.
              </p>

              <a
                href="/reports/1"
                className="mt-4 inline-block rounded-lg bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800"
              >
                Open Report
              </a>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}