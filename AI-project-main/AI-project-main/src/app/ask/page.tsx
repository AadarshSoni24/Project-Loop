"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function AskLoopPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I'm LOOP. Ask me anything about your customer feedback.",
    },
  ]);

  const handleAsk = () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return;
    }

    const lowerQuestion = trimmedQuestion.toLowerCase();

    let answer =
      "Based on the available feedback, customers are generally positive about the service, while delivery delays and response times are the main areas that need attention.";

    if (
      lowerQuestion.includes("complain") ||
      lowerQuestion.includes("problem") ||
      lowerQuestion.includes("issue")
    ) {
      answer =
        "The main customer complaints are related to delivery delays and response times. These areas should be prioritized for improvement.";
    } else if (
      lowerQuestion.includes("positive") ||
      lowerQuestion.includes("happy")
    ) {
      answer =
        "68% of the available feedback is positive. Customers frequently mention helpful support and good overall service.";
    } else if (
      lowerQuestion.includes("negative") ||
      lowerQuestion.includes("bad")
    ) {
      answer =
        "19% of feedback is negative. Delivery delays and response times are the most important negative themes.";
    } else if (
      lowerQuestion.includes("theme") ||
      lowerQuestion.includes("trend")
    ) {
      answer =
        "Customer Support is currently the largest tracked theme, followed by Delivery and Service Quality. Customer Support is also showing an upward trend.";
    } else if (
      lowerQuestion.includes("rating") ||
      lowerQuestion.includes("score")
    ) {
      answer =
        "The current average customer rating is 4.2 out of 5, indicating an overall positive customer experience.";
    } else if (
      lowerQuestion.includes("summary") ||
      lowerQuestion.includes("summarize")
    ) {
      answer =
        "Overall feedback is positive. Customers appreciate the service and support, while delivery delays and response times remain the main areas requiring attention.";
    }

    setMessages([
      ...messages,
      {
        role: "user",
        text: trimmedQuestion,
      },
      {
        role: "assistant",
        text: answer,
      },
    ]);

    setQuestion("");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">

      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Ask LOOP
          </h1>

          <p className="mt-2 text-gray-600">
            Ask questions about your customer feedback.
          </p>
        </div>

        {/* Chat */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* Messages */}
          <div className="min-h-[420px] space-y-5 p-6">

            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >

                <div
                  className={
                    message.role === "user"
                      ? "max-w-[80%] rounded-xl bg-gray-900 px-5 py-4 text-white"
                      : "max-w-[80%] rounded-xl bg-gray-100 px-5 py-4 text-gray-900"
                  }
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-60">
                    {message.role === "user" ? "You" : "LOOP"}
                  </p>

                  <p className="leading-6">
                    {message.text}
                  </p>
                </div>

              </div>
            ))}

            {/* Citation */}
            {messages.length > 1 && (
              <div className="ml-0 max-w-[80%] rounded-lg border border-gray-200 bg-white p-4">

                <p className="text-sm font-semibold text-gray-800">
                  Feedback sources
                </p>

                <div className="mt-3 space-y-3">

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-sm text-gray-700">
                      "Great service and very helpful support."
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Rahul · App Store · Positive
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-sm text-gray-700">
                      "Delivery was late and I had to wait."
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Priya · Email · Negative
                    </p>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-5">

            <div className="flex gap-3">

              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAsk();
                  }
                }}
                placeholder="Ask a question about your feedback..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />

              <button
                type="button"
                onClick={handleAsk}
                className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
              >
                Ask
              </button>

            </div>

            <p className="mt-3 text-xs text-gray-500">
              Example: "What are customers complaining about most?"
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}