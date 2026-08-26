"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

interface NavbarProps {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function Navbar({
  title,
  subtitle,
  actionHref,
  actionLabel,
}: NavbarProps) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const role = user?.role || "VIEWER";
  const userName = user?.name || "Acme User";

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white px-6 py-4 border border-gray-200 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition shadow-sm"
          >
            {actionLabel}
          </Link>
        )}

        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white font-medium text-xs">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-900">{userName}</p>
            <p className="text-[10px] text-gray-500 capitalize">{role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
