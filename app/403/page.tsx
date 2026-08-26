"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 text-2xl font-bold mb-4">
          🚫
        </div>

        <h1 className="text-xl font-bold text-gray-900">
          Access Restricted (403 Forbidden)
        </h1>

        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
          Your current workspace user role lacks permission to access or modify this resource. Contact your workspace Admin for elevated permissions.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href="/dashboard"
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition"
          >
            Return to Dashboard →
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Switch Account
          </button>
        </div>
      </div>
    </main>
  );
}
