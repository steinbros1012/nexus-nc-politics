"use client";

import { useState } from "react";
import { CheckCircle, Mail, MessageSquare, Clock } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-[#0f172a]">Message Sent</h1>
        <p className="text-gray-500 leading-relaxed">
          Thank you for reaching out. We will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent bg-white text-[#0f172a] text-sm transition-shadow";

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2">
          Contact Us
        </h1>
        <p className="text-gray-500 text-base">
          Have a question, tip, or feedback? We would like to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left sidebar */}
        <div className="space-y-6">
          <div className="flex gap-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-[#b91c1c]/8 flex items-center justify-center">
              <Mail className="w-4.5 h-4.5 text-[#b91c1c]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0f172a] text-sm mb-0.5">General Inquiries</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Questions about our coverage, corrections, or feedback on the site.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-[#b91c1c]/8 flex items-center justify-center">
              <MessageSquare className="w-4.5 h-4.5 text-[#b91c1c]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0f172a] text-sm mb-0.5">Opinion Submissions</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Interested in submitting an editorial or letter? Use our{" "}
                <a href="/submit-opinion" className="text-[#1d4ed8] hover:underline">
                  submission form
                </a>{" "}
                instead.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-[#b91c1c]/8 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5 text-[#b91c1c]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0f172a] text-sm mb-0.5">Response Time</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We aim to respond to all messages within 2 business days.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400 leading-relaxed">
              To report a factual error in an aggregated summary, select
              &ldquo;Report a Correction&rdquo; from the subject dropdown. We take accuracy seriously
              and address corrections promptly.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                    Name <span className="text-[#b91c1c]">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                    Email <span className="text-[#b91c1c]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                  Subject <span className="text-[#b91c1c]">*</span>
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="feedback">Feedback</option>
                  <option value="correction">Report a Correction</option>
                  <option value="source">Suggest a News Source</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="opinion">Opinion Submission Question</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                  Message <span className="text-[#b91c1c]">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={inputClass}
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#0f172a] text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
