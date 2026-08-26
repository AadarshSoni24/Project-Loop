"use client";

import { useState } from "react";

export default function WorkspaceSettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("LOOP Workspace");
  const [description, setDescription] = useState(
    "Customer Feedback Intelligence workspace"
  );
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Workspace Settings
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your LOOP workspace information and preferences.
          </p>
        </div>

        {/* Settings Card */}
        <form
          onSubmit={handleSave}
          className="mt-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
        >

          {/* Workspace Name */}
          <div>
            <label
              htmlFor="workspaceName"
              className="block text-sm font-semibold text-gray-800"
            >
              Workspace Name
            </label>

            <input
              id="workspaceName"
              type="text"
              value={workspaceName}
              onChange={(e) => {
                setWorkspaceName(e.target.value);
                setSaved(false);
              }}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Description */}
          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-800"
            >
              Workspace Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setSaved(false);
              }}
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Timezone */}
          <div className="mt-6">
            <label
              htmlFor="timezone"
              className="block text-sm font-semibold text-gray-800"
            >
              Default Timezone
            </label>

            <select
              id="timezone"
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value);
                setSaved(false);
              }}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            >
              <option value="Asia/Kolkata">
                India Standard Time (IST)
              </option>

              <option value="UTC">
                UTC
              </option>

              <option value="America/New_York">
                Eastern Time (ET)
              </option>

              <option value="America/Los_Angeles">
                Pacific Time (PT)
              </option>

              <option value="Europe/London">
                London Time (GMT/BST)
              </option>
            </select>
          </div>

          {/* Save */}
          <div className="mt-8 flex items-center gap-4">

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Save Changes
            </button>

            {saved && (
              <p className="text-sm font-medium text-green-700">
                Workspace settings saved.
              </p>
            )}

          </div>

        </form>

        {/* Workspace Information */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="font-semibold">
            Workspace Information
          </h2>

          <div className="mt-4 space-y-3 text-sm">

            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-gray-500">
                Workspace ID
              </span>

              <span className="font-medium">
                workspace_demo_001
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-gray-500">
                Plan
              </span>

              <span className="font-medium">
                Professional
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Created
              </span>

              <span className="font-medium">
                August 2026
              </span>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}