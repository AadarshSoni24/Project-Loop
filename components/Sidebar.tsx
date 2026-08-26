"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Inbox", href: "/inbox", icon: "📥" },
  { label: "Analytics", href: "/analytics", icon: "📈" },
  { label: "Trends & Spikes", href: "/trends", icon: "🔥" },
  { label: "Ask LOOP (AI)", href: "/ask", icon: "✨" },
  { label: "VoC Reports", href: "/reports", icon: "📄" },
];

const SETTINGS_ITEMS = [
  { label: "Members", href: "/settings/members", icon: "👥" },
  { label: "Workspace", href: "/settings/workspace", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user as any;
  const role = user?.role || "VIEWER";
  const userName = user?.name || "Acme User";
  const userEmail = user?.email || "user@acme.com";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white flex flex-col justify-between p-5 text-gray-900 z-30 select-none">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-gray-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white font-bold text-lg shadow-sm">
            L
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
              LOOP
            </h1>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              Feedback AI
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href)) ||
              (item.href === "/dashboard" && pathname === "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings Section */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Settings
          </p>
          <nav className="space-y-1">
            {SETTINGS_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between gap-2 px-2 py-2 rounded-lg bg-gray-50 mb-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 font-semibold text-xs text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {userName}
              </p>
              <span
                className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                  role === "ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : role === "ANALYST"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {role}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
            className="rounded p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 text-xs transition"
          >
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
}
