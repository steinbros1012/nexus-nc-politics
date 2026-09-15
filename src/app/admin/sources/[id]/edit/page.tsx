"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface SourceData {
  id: string;
  name: string;
  slug: string;
  website: string;
  rssUrl: string | null;
  description: string | null;
  active: boolean;
  articleCount: number;
  hasError: boolean;
  errorMessage: string | null;
}

export default function EditSourcePage() {
  const params = useParams();
  const router = useRouter();
  const [source, setSource] = useState<SourceData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/admin/sources/${params.id}`)
      .then((r) => r.json())
      .then((data) => setSource(data.source))
      .catch(() => setMessage("Failed to load."));
  }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!source) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/sources/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: source.name,
          website: source.website,
          rssUrl: source.rssUrl,
          description: source.description,
          active: source.active,
        }),
      });
      if (res.ok) {
        setMessage("Saved successfully.");
      } else {
        setMessage("Failed to save.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this source and all its articles?")) return;
    const res = await fetch(`/api/admin/sources/${params.id}`, {
      method: "DELETE",
    });
    if (res.ok) router.push("/admin/sources");
  }

  async function triggerIngest() {
    setMessage("Ingesting...");
    const res = await fetch(`/api/admin/ingest/${params.id}`, {
      method: "POST",
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(
        `Ingestion complete: ${data.result.articlesNew} new, ${data.result.articlesDupe} dupes, ${data.result.articlesErr} errors`
      );
    } else {
      setMessage(`Ingestion failed: ${data.error || "Unknown error"}`);
    }
  }

  if (!source) {
    return (
      <div className="p-8 text-center text-gray-500">
        {message || "Loading..."}
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Source</h1>
        <Link
          href="/admin/sources"
          className="text-sm text-gray-500 hover:text-gray-700 no-underline"
        >
          Back to Sources
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-5 bg-white p-6 rounded-lg border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            value={source.name}
            onChange={(e) => setSource({ ...source, name: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            value={source.website}
            onChange={(e) => setSource({ ...source, website: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RSS URL
          </label>
          <input
            value={source.rssUrl || ""}
            onChange={(e) =>
              setSource({ ...source, rssUrl: e.target.value || null })
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={source.description || ""}
            onChange={(e) =>
              setSource({ ...source, description: e.target.value || null })
            }
            rows={3}
            className={inputClass}
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={source.active}
            onChange={(e) =>
              setSource({ ...source, active: e.target.checked })
            }
          />
          <span className="text-sm">Active</span>
        </label>

        <div className="text-sm text-gray-500">
          Articles: {source.articleCount} | Slug: {source.slug}
          {source.hasError && (
            <p className="text-red-600 mt-1">Error: {source.errorMessage}</p>
          )}
        </div>

        {message && (
          <p
            className={`text-sm ${message.includes("success") || message.includes("complete") ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Delete Source
            </button>
            <button
              type="button"
              onClick={triggerIngest}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ingest Now
            </button>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
