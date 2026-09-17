"use client";

import { useState } from "react";

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
    <section className="bg-[#0f172a] text-white rounded-xl p-6 border border-white/5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b91c1c]">
          Newsletter
        </span>
      </div>
      <h3 className="text-base font-bold text-white mb-1.5 tracking-tight leading-snug">
        Stay up to date on NC Politics
      </h3>
      <p className="text-gray-500 text-xs mb-4 leading-relaxed">
        Get the most important North Carolina political news delivered to your inbox.
      </p>

      {status === "success" ? (
        <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
          <div className="w-4 h-4 rounded-full bg-green-400/20 flex items-center justify-center shrink-0">
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-3.5 py-2.5 rounded-lg bg-white/8 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-2.5 bg-[#b91c1c] hover:bg-red-700 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm text-white"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-red-400 text-xs mt-2">{message}</p>
      )}
    </section>
  );
}
