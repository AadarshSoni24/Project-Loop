"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function MembersSettingsPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("VIEWER");
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadMembers = async () => {
    try {
      const res = await fetch("/api/workspace/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim() || !email.trim()) {
      setMessage({ text: "Name and email are required.", type: "error" });
      return;
    }

    setInviting(true);

    try {
      const res = await fetch("/api/workspace/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMembers((prev) => [...prev, data]);
        setName("");
        setEmail("");
        setRole("VIEWER");
        setShowInvite(false);
        setMessage({ text: `Invited ${data.name} as ${data.role}!`, type: "success" });
      } else {
        setMessage({ text: data.message || data.error || "Failed to invite member.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error sending invitation.", type: "error" });
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/workspace/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
        );
        setMessage({ text: "Role updated successfully.", type: "success" });
      }
    } catch (err) {
      setMessage({ text: "Failed to update role.", type: "error" });
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const res = await fetch(`/api/workspace/members?userId=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== userId));
        setMessage({ text: "Member removed from workspace.", type: "success" });
      } else {
        const data = await res.json();
        setMessage({ text: data.message || "Failed to remove member.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error removing member.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <Navbar
          title="Workspace Members"
          subtitle="Manage workspace users, invitations, and role-based access control (RBAC)."
        />

        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-gray-500 font-medium">
              Members list ({members.length} users)
            </p>

            <button
              onClick={() => {
                setShowInvite(!showInvite);
                setMessage(null);
              }}
              className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition shadow-sm"
            >
              {showInvite ? "Close Invite Form" : "+ Invite Member"}
            </button>
          </div>

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

          {/* Invite Form Card */}
          {showInvite && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">
                Invite New Team Member
              </h3>

              <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="rounded-lg border border-gray-300 px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-gray-900"
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="rounded-lg border border-gray-300 px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-gray-900"
                />

                <div className="flex gap-2">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-900"
                  >
                    <option value="VIEWER">Viewer</option>
                    <option value="ANALYST">Analyst</option>
                    <option value="ADMIN">Admin</option>
                  </select>

                  <button
                    type="submit"
                    disabled={inviting}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition shadow-xs"
                  >
                    {inviting ? "Inviting..." : "Invite"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Members Table */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-gray-50 text-[10px] uppercase font-semibold text-gray-500">
                  <tr>
                    <th className="px-6 py-3.5">User</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                        Loading workspace members...
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50/80 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-white text-xs">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          {member.name}
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">{member.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="ANALYST">ANALYST</option>
                            <option value="VIEWER">VIEWER</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleRemove(member.id)}
                            className="text-xs font-semibold text-red-600 hover:text-red-800 transition"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RBAC Role Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
              <span className="font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                ADMIN
              </span>
              <p className="text-xs text-gray-600 mt-2">
                Full workspace authority, member invites, settings editing, and raw data export.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
              <span className="font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                ANALYST
              </span>
              <p className="text-xs text-gray-600 mt-2">
                Manage feedback status, trigger AI re-classification, CSV imports, and generate VoC digests.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
              <span className="font-bold text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                VIEWER
              </span>
              <p className="text-xs text-gray-600 mt-2">
                Read-only access to dashboards, feedback analytics, trends, and reports.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
