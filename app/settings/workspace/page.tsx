"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function WorkspaceSettingsPage() {
  const [workspace, setWorkspace] = useState<any>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const res = await fetch("/api/workspace");
        if (res.ok) {
          const data = await res.json();
          setWorkspace(data);
          setName(data.name);
        }
      } catch (err) {
        console.error("Failed to load workspace:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkspace();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim() || name.trim().length < 2) {
      setMessage({ text: "Workspace name must be at least 2 characters.", type: "error" });
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        const updated = await res.json();
        setWorkspace(updated);
        setMessage({ text: "Workspace settings updated successfully!", type: "success" });
      } else {
        const errData = await res.json();
        setMessage({ text: errData.message || "Failed to update workspace.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "An error occurred while saving.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Workspace Settings"
          subtitle="Configure your team workspace information and environment preferences."
        />

        <div className="max-w-3xl">
          {message && (
            <div
              className={`mb-6 rounded-xl border p-4 text-xs font-semibold ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-xs text-gray-400">
              Loading workspace settings...
            </div>
          ) : (
            <div className="space-y-6">
              {/* Workspace Details Card */}
              <form
                onSubmit={handleSave}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5"
              >
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    General Workspace Preferences
                  </h3>
                  <p className="text-xs text-gray-500">
                    Update your workspace display name and tenant configuration.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="workspaceName"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
                  >
                    Workspace Name
                  </label>
                  <input
                    id="workspaceName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Workspace Identifier (Tenant ID)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={workspace?.id || ""}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-mono text-gray-500 select-all cursor-not-allowed"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Unique multi-tenant isolation key used for API and vector indexing.
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Created on {workspace?.createdAt ? new Date(workspace.createdAt).toLocaleDateString() : "Aug 2026"}
                  </span>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-gray-900 px-5 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition shadow-sm"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>

              {/* Data & Resource Usage Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4">
                  Workspace Resource Counts
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                    <span className="text-[10px] font-semibold uppercase text-gray-400">Total Users</span>
                    <p className="text-xl font-bold text-gray-900 mt-1">{workspace?._count?.users ?? 3}</p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                    <span className="text-[10px] font-semibold uppercase text-gray-400">Indexed Feedback</span>
                    <p className="text-xl font-bold text-gray-900 mt-1">{workspace?._count?.feedback ?? 125}</p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                    <span className="text-[10px] font-semibold uppercase text-gray-400">Active Themes</span>
                    <p className="text-xl font-bold text-gray-900 mt-1">{workspace?._count?.themes ?? 7}</p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                    <span className="text-[10px] font-semibold uppercase text-gray-400">VoC Reports</span>
                    <p className="text-xl font-bold text-gray-900 mt-1">{workspace?._count?.reports ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
