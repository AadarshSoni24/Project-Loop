"use client";

export default function AddFeedbackPage() {
  return (
    <main className="min-h-screen bg-gray-200 p-8 text-gray-900">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Add Feedback
        </h1>

        <p className="mt-2 text-gray-700">
          Add new customer feedback
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 max-w-3xl rounded-xl border border-gray-300 bg-white p-8 shadow-md">

        {/* Customer Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Customer Name
          </label>

          <input
            type="text"
            placeholder="Enter customer name"
            className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Email */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter customer email"
            className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Feedback */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Feedback
          </label>

          <textarea
            rows={5}
            placeholder="Enter customer feedback"
            className="w-full resize-none rounded-lg border border-gray-400 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Rating */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Rating
          </label>

          <select
            defaultValue="5"
            className="rounded-lg border border-gray-400 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-700"
          >
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          className="mt-8 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
        >
          Submit Feedback
        </button>

      </div>

    </main>
  );
}