import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
          !
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Access Denied
        </h1>

        <p className="mt-3 leading-6 text-gray-600">
          You don't have permission to access this page.
          Please contact your workspace administrator if you believe
          you should have access.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Link
            href="/dashboard"
            className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            Back to Dashboard
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-800 hover:bg-gray-50"
          >
            Sign In
          </Link>

        </div>

      </div>
    </main>
  );
}