"use client";

import { useState } from "react";

type Member = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Analyst" | "Viewer";
};

const initialMembers: Member[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
  },
  {
    id: 2,
    name: "Sarah Analyst",
    email: "sarah@example.com",
    role: "Analyst",
  },
  {
    id: 3,
    name: "John Viewer",
    email: "john@example.com",
    role: "Viewer",
  },
];

export default function MembersPage() {
  const [members, setMembers] = useState(initialMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Member["role"]>("Viewer");
  const [message, setMessage] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter an email address.");
      return;
    }

    const newMember: Member = {
      id: Date.now(),
      name: "Invited User",
      email: email.trim(),
      role,
    };

    setMembers((current) => [...current, newMember]);
    setEmail("");
    setRole("Viewer");
    setMessage("Invitation added successfully.");
    setShowInvite(false);
  };

  const handleRoleChange = (
    id: number,
    newRole: Member["role"]
  ) => {
    setMembers((current) =>
      current.map((member) =>
        member.id === id
          ? { ...member, role: newRole }
          : member
      )
    );
  };

  const handleRemove = (id: number) => {
    setMembers((current) =>
      current.filter((member) => member.id !== id)
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Workspace Members
            </h1>

            <p className="mt-2 text-gray-600">
              Manage members and their workspace roles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowInvite(!showInvite);
              setMessage("");
            }}
            className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            + Invite Member
          </button>
        </div>

        {/* Invite Form */}
        {showInvite && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Invite a Member
            </h2>

            <form
              onSubmit={handleInvite}
              className="mt-5 grid gap-4 md:grid-cols-[1fr_220px_auto]"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
                className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as Member["role"])
                }
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
              >
                <option value="Admin">Admin</option>
                <option value="Analyst">Analyst</option>
                <option value="Viewer">Viewer</option>
              </select>

              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-800"
              >
                Send Invite
              </button>
            </form>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Members Table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="font-semibold">
              Members ({members.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Member
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Role
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <p className="font-medium">
                        {member.name}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {member.email}
                    </td>

                    <td className="px-6 py-5">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(
                            member.id,
                            e.target.value as Member["role"]
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Analyst">Analyst</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </td>

                    <td className="px-6 py-5 text-right">
                      {member.role !== "Admin" && (
                        <button
                          type="button"
                          onClick={() => handleRemove(member.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* Role Information */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="font-semibold">
            Role permissions
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-semibold">
                Admin
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Full workspace access and member management.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-semibold">
                Analyst
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Manage feedback and generate reports.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-semibold">
                Viewer
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Read-only access to workspace information.
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}