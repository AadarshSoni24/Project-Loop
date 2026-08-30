"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

interface CitedItem {
  id: string;
  content: string;
  channel: string;
  sentiment: string;
  createdAt: string;
  customerLabel?: string;
  similarityScore: number;
}

interface Message {
  role: "user" | "assistant";
  text: string;
  citedFeedback?: CitedItem[];
}

const STARTER_PROMPTS = [
  "What are customers saying about onboarding and invitations?",
  "What are the main complaints regarding billing and invoices?",
  "What features do customers appreciate most about the dashboard?",
  "What are the top enterprise security & SSO requests?",
];

export default function AskLoopPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I am LOOP AI. Ask me any natural language question about your workspace customer feedback. Every response is grounded directly in vector-indexed customer evidence.",
    },
  ]);

  const handleAsk = async (queryToSubmit?: string) => {
    const q = (queryToSubmit || question).trim();
    if (!q || loading) return;

    const userMessage: Message = { role: "user", text: q };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/insights/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();

      if (res.ok) {
        const assistantMessage: Message = {
          role: "assistant",
          text: data.answer,
          citedFeedback: data.citedFeedback || [],
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.message || data.error || "Sorry, I encountered an error answering your question.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "An error occurred while communicating with the Ask LOOP intelligence engine.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 p-8 flex flex-col justify-between">
        <div>
          <Navbar
            title="Ask LOOP (Grounded AI Q&A)"
            subtitle="Query customer feedback with retrieval-augmented vector intelligence."
          />

          {/* Quick Starter Chips */}
          <div className="mb-6 flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleAsk(prompt)}
                disabled={loading}
                className="rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition shadow-xs disabled:opacity-40"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Transcript Area */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-6">
            <div className="p-6 space-y-6 min-h-[440px] max-h-[560px] overflow-y-auto">
              {messages.map((m, index) => {
                const isUser = m.role === "user";

                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-3xl rounded-2xl px-5 py-4 text-xs leading-relaxed shadow-xs ${
                        isUser
                          ? "bg-gray-900 text-white rounded-br-none"
                          : "bg-gray-50 text-gray-900 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60">
                        {isUser ? "You" : "LOOP Intelligence"}
                      </p>
                      <div className="whitespace-pre-wrap font-sans text-[13px]">
                        {m.text}
                      </div>

                      {/* Cited Evidence Cards */}
                      {m.citedFeedback && m.citedFeedback.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200 text-left">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Cited Evidence ({m.citedFeedback.length} items)
                          </p>
                          <div className="space-y-2">
                            {m.citedFeedback.map((cited: CitedItem, cIdx: number) => (
                              <div
                                key={cIdx}
                                className="rounded-lg bg-white p-3 border border-gray-200 text-xs shadow-2xs"
                              >
                                <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 mb-1">
                                  <span className="capitalize font-bold text-gray-800">
                                    [{cited.channel.replace("_", " ")}]
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.2 rounded font-bold ${
                                      cited.sentiment === "POS"
                                        ? "bg-green-100 text-green-700"
                                        : cited.sentiment === "NEG"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {cited.sentiment} • Match: {Math.round(cited.similarityScore * 100)}%
                                  </span>
                                </div>
                                <p className="text-gray-800 italic">
                                  &ldquo;{cited.content}&rdquo;
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-200 max-w-xs animate-pulse">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                  Analyzing vector embeddings & synthesizing answer...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAsk();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask any question about customer sentiment, feedback, or themes..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-xs text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={!question.trim() || loading}
                  className="rounded-xl bg-gray-900 px-6 py-3 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-40 transition shadow-sm"
                >
                  {loading ? "Searching..." : "Ask LOOP →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
