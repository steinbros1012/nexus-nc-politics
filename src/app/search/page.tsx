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
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-1">
          Search
        </h1>
        <p className="text-gray-500 text-sm">
          Search across all NC political news articles.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NC political news..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent text-sm bg-white"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-[#0f172a] text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-[#b91c1c] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Searching...</p>
        </div>
      )}

      {/* No results */}
      {!loading && searched && results.length === 0 && (
        <div className="py-16 text-center">
          <SearchIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#0f172a] font-semibold mb-1">No results found</p>
          <p className="text-gray-400 text-sm">
            No articles matched &ldquo;{query}&rdquo;. Try different keywords.
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-5">
            <span className="font-semibold text-[#0f172a]">{results.length}</span>{" "}
            result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state (before any search) */}
      {!searched && !loading && (
        <div className="py-16 text-center">
          <SearchIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            Enter a keyword above to search NC political news.
          </p>
        </div>
      )}
    </div>
  );
}
