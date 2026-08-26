"use client";

import { useState } from "react";

export default function AskLoopPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = () => {
    if (!question.trim()) {
      return;
    }

    setAnswer(
      "Based on the current feedback data, 68% of customers are positive, 19% are negative, and 13% are neutral."
    );
  };

  return (
    <main className="min-h-screen bg-gray-200 p-8 text-gray-900">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Ask AI
        </h1>

        <p className="mt-2 text-gray-700">
          Ask questions about your customer feedback
        </p>
      </div>

      {/* Chat Card */}
      <div className="mt-8 max-w-4xl rounded-xl border border-gray-300 bg-white p-8 shadow-md">

        {/* LOOP Message */}
        <div className="rounded-lg bg-gray-100 p-5">

          <p className="font-semibold text-gray-900">
            Ask AI
          </p>

          <p className="mt-2 text-gray-700">
            Hello! Ask me anything about your customer feedback.
          </p>

        </div>

        {/* Answer */}
        {answer && (
          <div className="mt-6 rounded-lg border border-gray-300 bg-white p-5">

            <p className="font-semibold text-gray-900">
              LOOP
            </p>

            <p className="mt-2 text-gray-700">
              {answer}
            </p>

          </div>
        )}

        {/* Question Input */}
        <div className="mt-6 flex gap-3">

          <input
            type="text"
            placeholder="Ask something..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk();
              }
            }}
            className="flex-1 rounded-lg border border-gray-400 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-300"
          />

          <button
            type="button"
            onClick={handleAsk}
            className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-700"
          >
            Ask
          </button>

        </div>

      </div>

    </main>
  );
}