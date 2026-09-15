"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  isBreaking: boolean;
  isFeatured: boolean;
  isEditorsPick: boolean;
  isHidden: boolean;
  tags: string[];
  originalUrl: string;
  source: { name: string };
  category: { name: string; slug: string } | null;
}

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/admin/articles/${params.id}`)
      .then((r) => r.json())
      .then((data) => setArticle(data.article))
      .catch(() => setMessage("Failed to load article."));
  }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!article) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/articles/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isBreaking: article.isBreaking,
          isFeatured: article.isFeatured,
          isEditorsPick: article.isEditorsPick,
          isHidden: article.isHidden,
          summary: article.summary,
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
    if (!confirm("Delete this article? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/articles/${params.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/articles");
    }
  }

  if (!article) {
    return (
      <div className="p-8 text-center text-gray-500">
        {message || "Loading..."}
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Article</h1>
        <Link
          href="/admin/articles"
          className="text-sm text-gray-500 hover:text-gray-700 no-underline"
        >
          Back to Articles
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <p className="text-lg font-semibold">{article.title}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <p className="text-gray-600">{article.source.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original URL
          </label>
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm break-all"
          >
            {article.originalUrl}
          </a>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Summary
          </label>
          <textarea
            value={article.summary || ""}
            onChange={(e) =>
              setArticle({ ...article, summary: e.target.value })
            }
            rows={4}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={article.isBreaking}
              onChange={(e) =>
                setArticle({ ...article, isBreaking: e.target.checked })
              }
            />
            <span className="text-sm">Breaking News</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={article.isFeatured}
              onChange={(e) =>
                setArticle({ ...article, isFeatured: e.target.checked })
              }
            />
            <span className="text-sm">Featured</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={article.isEditorsPick}
              onChange={(e) =>
                setArticle({ ...article, isEditorsPick: e.target.checked })
              }
            />
            <span className="text-sm">Editor&apos;s Pick</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={article.isHidden}
              onChange={(e) =>
                setArticle({ ...article, isHidden: e.target.checked })
              }
            />
            <span className="text-sm">Hidden</span>
          </label>
        </div>

        {message && (
          <p
            className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Delete Article
          </button>
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
