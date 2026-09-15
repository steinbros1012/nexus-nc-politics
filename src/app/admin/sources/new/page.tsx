"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewSourcePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    website: "",
    rssUrl: "",
    description: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setForm({ ...form, [target.name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/sources");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create source.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add News Source</h1>
        <Link
          href="/admin/sources"
          className="text-sm text-gray-500 hover:text-gray-700 no-underline"
        >
          Back to Sources
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website URL *
          </label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            required
            type="url"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RSS Feed URL
          </label>
          <input
            name="rssUrl"
            value={form.rssUrl}
            onChange={handleChange}
            type="url"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={inputClass}
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />
          <span className="text-sm">Active (enable RSS ingestion)</span>
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create Source"}
        </button>
      </form>
    </div>
  );
}
