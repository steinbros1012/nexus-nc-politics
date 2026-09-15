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
    <section className="bg-header-bg text-white rounded-lg p-8">
      <div className="max-w-xl mx-auto text-center">
        <Mail className="w-10 h-10 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold mb-2">
          Stay Up to Date on NC Politics
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Get the most important North Carolina political news delivered to your
          inbox.
        </p>

        {status === "success" ? (
          <p className="text-green-400 font-medium">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex-1 px-4 py-2.5 rounded bg-gray-800 border border-gray-600 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-2.5 bg-accent hover:bg-red-700 rounded font-medium transition-colors disabled:opacity-50"
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
