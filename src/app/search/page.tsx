"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import ArticleCard from "@/components/news/ArticleCard";

interface SearchArticle {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  publishedAt: string;
  isBreaking: boolean;
  source: { name: string };
  category: { name: string; slug: string } | null;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, []);

  async function performSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q.trim())}`
      );
      const data = await res.json();
      setResults(data.articles || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    performSearch(query);
    window.history.replaceState(null, "", `/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NC political news..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-link"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-header-bg text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Search
        </button>
      </form>

      {loading && (
        <p className="text-muted text-center py-8">Searching...</p>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-muted text-center py-8">
          No articles found for &quot;{query}&quot;. Try different keywords.
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-1 mb-6">
          <p className="text-sm text-muted">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
