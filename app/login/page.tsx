"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@acme.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || "Invalid email or password.");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("admin123");
    setError("");
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

        {/* Login Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Sign in to your workspace account.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@acme.com"
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-16 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-900"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5 text-center">
              Quick Fill Demo Accounts (Password: admin123)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@acme.com")}
                className="rounded-lg border border-purple-200 bg-purple-50/60 py-1.5 px-2 text-center text-xs font-semibold text-purple-700 hover:bg-purple-100 transition"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("analyst@acme.com")}
                className="rounded-lg border border-blue-200 bg-blue-50/60 py-1.5 px-2 text-center text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
              >
                🔬 Analyst
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("viewer@acme.com")}
                className="rounded-lg border border-gray-200 bg-gray-50 py-1.5 px-2 text-center text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                👀 Viewer
              </button>
            </div>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center text-xs text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-gray-900 hover:underline"
            >
              Create workspace
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 LOOP Customer Feedback Intelligence
        </p>
      </div>
    </main>
  );
}
