"use client";

import Link from "next/link";
import { useState } from "react";

type CsvRow = {
  customer: string;
  feedback: string;
  channel: string;
  date: string;
};

export default function ImportFeedbackPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [error, setError] = useState("");
  const [imported, setImported] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setImported(false);
    setRows([]);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setError("Please select a CSV file.");
      return;
    }

    setFile(selectedFile);

    const text = await selectedFile.text();
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      setError("The CSV file must contain a header and at least one row.");
      return;
    }

    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().toLowerCase());

    const requiredColumns = [
      "customer",
      "feedback",
      "channel",
      "date",
    ];

    const missingColumns = requiredColumns.filter(
      (column) => !headers.includes(column)
    );

    if (missingColumns.length > 0) {
      setError(
        `Missing required column(s): ${missingColumns.join(", ")}`
      );
      return;
    }

    const parsedRows: CsvRow[] = lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());

      return {
        customer: values[headers.indexOf("customer")] || "",
        feedback: values[headers.indexOf("feedback")] || "",
        channel: values[headers.indexOf("channel")] || "",
        date: values[headers.indexOf("date")] || "",
      };
    });

    setRows(parsedRows);
  };

  const handleImport = () => {
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    if (rows.length === 0) {
      setError("There are no valid rows to import.");
      return;
    }

    setImported(true);
    setError("");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-4xl">

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
            Import Feedback
          </h1>

          <p className="mt-2 text-gray-600">
            Upload a CSV file to import multiple feedback items.
          </p>
        </div>

        {/* Upload Card */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

          <label className="block text-sm font-semibold">
            CSV File
          </label>

          <div className="mt-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">

            <p className="text-gray-600">
              Select a CSV file from your computer
            </p>

            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="mt-5 block w-full text-sm text-gray-600"
            />

          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-5 rounded-lg bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Selected file
              </p>

              <p className="mt-1 font-medium">
                {file.name}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>

            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Preview Count */}
          {rows.length > 0 && (
            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">

              <p className="font-semibold text-blue-800">
                CSV ready to import
              </p>

              <p className="mt-1 text-sm text-blue-700">
                {rows.length} feedback row
                {rows.length !== 1 ? "s" : ""} detected.
              </p>

            </div>
          )}

          {/* Import Button */}
          <button
            type="button"
            onClick={handleImport}
            disabled={!file || rows.length === 0}
            className="mt-6 rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Import CSV
          </button>

          {/* Success */}
          {imported && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5">

              <h2 className="font-semibold text-green-800">
                Import completed
              </h2>

              <p className="mt-2 text-sm text-green-700">
                {rows.length} feedback item
                {rows.length !== 1 ? "s" : ""} imported successfully.
              </p>

              <p className="mt-1 text-sm text-green-700">
                0 rows failed.
              </p>

            </div>
          )}

        </div>

        {/* Preview */}
        {rows.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-semibold">
                Preview
              </h2>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b border-gray-200">
                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Feedback
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Channel
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Date
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {rows.slice(0, 10).map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 last:border-0"
                    >

                      <td className="px-6 py-4 font-medium">
                        {row.customer || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {row.feedback || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {row.channel || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {row.date || "—"}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            {rows.length > 10 && (
              <p className="border-t border-gray-200 px-6 py-4 text-sm text-gray-500">
                Showing the first 10 rows of {rows.length}.
              </p>
            )}

          </div>
        )}

        {/* CSV Format */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            CSV Format
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Your CSV should contain these columns:
          </p>

          <div className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4">
            <code className="text-sm text-white">
              customer,feedback,channel,date
            </code>
          </div>

        </div>

      </div>
    </main>
  );
}