"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim() || !workspaceName.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          workspaceName: workspaceName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      // Automatically sign in with newly created credentials
      const signInRes = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError("Account created. Please sign in.");
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white font-bold text-2xl shadow-sm mb-3">
            L
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            LOOP
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Customer Feedback Intelligence
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Create your workspace
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Start analyzing customer feedback with AI intelligence.
          </p>

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition"
              />
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
              >
                Work Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition"
              />
            </div>

            {/* Workspace Name */}
            <div>
              <label
                htmlFor="workspaceName"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
              >
                Workspace / Organization Name
              </label>
              <input
                id="workspaceName"
                type="text"
                required
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition shadow-sm"
            >
              {loading ? "Creating Workspace..." : "Create Account & Workspace"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-gray-900 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
