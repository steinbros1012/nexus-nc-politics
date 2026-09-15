"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You are subscribed.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section className="bg-[#0f172a] text-white rounded-lg p-7">
      <div className="max-w-xl mx-auto text-center">
        <Mail className="w-8 h-8 mx-auto mb-3 text-gray-500" />
        <h3 className="text-lg font-bold mb-1.5 tracking-tight">
          Stay Up to Date on NC Politics
        </h3>
        <p className="text-gray-500 text-sm mb-5 leading-relaxed">
          Get the most important North Carolina political news delivered to your
          inbox.
        </p>

        {status === "success" ? (
          <p className="text-green-400 font-medium text-sm">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex-1 px-4 py-2.5 rounded bg-white/10 border border-gray-700 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent text-sm"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-5 py-2.5 bg-link hover:bg-blue-700 rounded font-medium transition-colors disabled:opacity-50 text-sm"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-red-400 text-sm mt-2">{message}</p>
        )}
      </div>
    </section>
  );
}
