"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface LogEntry {
  id: string;
  status: string;
  message: string | null;
  articlesNew: number;
  articlesDupe: number;
  articlesErr: number;
  duration: number | null;
  createdAt: string;
  source: { name: string };
}

interface SourceHealth {
  id: string;
  name: string;
  active: boolean;
  hasError: boolean;
  errorMessage: string | null;
  lastSuccessfulFetch: string | null;
  lastAttemptedFetch: string | null;
  articleCount: number;
}

export default function IngestionPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sources, setSources] = useState<SourceHealth[]>([]);
  const [ingesting, setIngesting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch("/api/admin/ingest");
      const data = await res.json();
      setLogs(data.logs || []);
      setSources(data.sources || []);
    } catch {
      setMessage("Failed to load data.");
    }
  }

  async function triggerFullIngest() {
    setIngesting(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/ingest", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        const total = data.results.reduce(
          (sum: number, r: { articlesNew: number }) => sum + r.articlesNew,
          0
        );
        setMessage(`Ingestion complete. ${total} new articles imported.`);
        loadData();
      } else {
        setMessage(`Failed: ${data.error}`);
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setIngesting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Feed Ingestion</h1>
        <button
          onClick={triggerFullIngest}
          disabled={ingesting}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {ingesting ? "Ingesting..." : "Ingest All Sources"}
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm ${
            message.includes("complete")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Source health */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-8">
        <h2 className="font-bold text-lg mb-4">Source Health</h2>
        <div className="space-y-3">
          {sources.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    s.hasError
                      ? "bg-red-500"
                      : s.active
                        ? "bg-green-500"
                        : "bg-gray-400"
                  }`}
                />
                <div>
                  <span className="font-medium text-sm">{s.name}</span>
                  {s.hasError && (
                    <p className="text-xs text-red-500">{s.errorMessage}</p>
                  )}
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <span>{s.articleCount} articles</span>
                {s.lastSuccessfulFetch && (
                  <p className="text-xs">
                    Last: {formatDate(s.lastSuccessfulFetch)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="font-bold text-lg mb-4">Recent Ingestion Logs</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">No ingestion logs yet.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0 text-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        log.status === "success"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium">{log.source.name}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {log.status === "success"
                      ? `+${log.articlesNew} new, ${log.articlesDupe} dupes, ${log.articlesErr} errors`
                      : log.message}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{formatDate(log.createdAt)}</p>
                  {log.duration && <p>{(log.duration / 1000).toFixed(1)}s</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
