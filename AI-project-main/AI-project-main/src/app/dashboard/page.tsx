import Link from "next/link";
import FeedbackChart from "@/components/FeedbackChart";
import SentimentChart from "@/components/SentimentChart";


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      
      {/* Sidebar */}
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-300 p-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">
          LOOP
        </h1>

    <nav className="space-y-2">

  <Link
    href="/dashboard"
    className="block rounded-lg bg-gray-100 px-4 py-3"
  >
    Dashboard
  </Link>

  <Link
    href="/inbox"
    className="block rounded-lg px-4 py-3 hover:bg-gray-100"
  >
    Inbox
  </Link>

  <Link
    href="/analytics"
    className="block rounded-lg px-4 py-3 hover:bg-gray-100"
  >
    Analytics
  </Link>

  <Link
    href="/trends"
    className="block rounded-lg px-4 py-3 hover:bg-gray-100"
  >
    Trends
  </Link>

  <Link
    href="/ask"
    className="block rounded-lg px-4 py-3 hover:bg-gray-100"
  >
    Ask LOOP
  </Link>

  <Link
    href="/reports"
    className="block rounded-lg px-4 py-3 hover:bg-gray-100"
  >
    Reports
  </Link>

  <div className="my-4 border-t border-gray-200" />

  <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
    Settings
  </p>

  <Link
    href="/settings/members"
    className="block rounded-lg px-4 py-3 hover:bg-gray-100"
  >
    Members
  </Link>

  <Link
    href="/settings/workspace"
    className="block rounded-lg px-4 py-3 hover:bg-gray-100"
  >
    Workspace
  </Link>

</nav>
      </aside>

      {/* Main Content */}
      <section className="ml-64 p-8">

{/* Top Navbar */}
<div className="mb-8 flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow-sm">
  
  <div>
    <p className="text-sm text-gray-500">
      Overview
    </p>

    <h2 className="text-xl font-semibold">
      Dashboard
    </h2>
  </div>

  <div className="flex items-center gap-4">

    <input
      type="text"
      placeholder="Search..."
      className="w-64 rounded-lg border px-4 py-2 outline-none focus:ring-2"
    />

    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
        A
      </div>

      <div>
        <p className="text-sm font-medium">
          Admin
        </p>

        <p className="text-xs text-gray-500">
          Manager
        </p>
      </div>
    </div>

  </div>
</div>
<h2 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h2>

        <p className="mt-2 text-gray-600">
          Welcome to LOOP Customer Feedback Intelligence
        </p>

        {/* Dashboard Cards */}
        <div className="mt-8 grid grid-cols-4 gap-6">

          {/* Total Feedback */}
         <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">
              Total Feedback
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              1,248
            </h3>
          </div>

          {/* Positive */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Positive
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              68%
            </h3>
          </div>

          {/* Negative */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Negative
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              19%
            </h3>
          </div>

          {/* Neutral */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Neutral
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              13%
            </h3>
          </div>

        </div>
        <FeedbackChart />
<SentimentChart />
      </section>
    </main>
  );
}
