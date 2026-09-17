"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { CheckCircle, XCircle, Loader2, Play, RefreshCw } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ingest");
      const data = await res.json();
      setLogs(data.logs || []);
      setSources(data.sources || []);
    } catch {
      setMessage("Failed to load data.");
      setMessageType("error");
    } finally {
      setLoading(false);
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
        setMessageType("success");
        loadData();
      } else {
        setMessage(`Failed: ${data.error}`);
        setMessageType("error");
      }
    } catch {
      setMessage("Network error.");
      setMessageType("error");
    } finally {
      setIngesting(false);
    }
  }

  const activeCount = sources.filter((s) => s.active && !s.hasError).length;
  const errorCount = sources.filter((s) => s.hasError).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Feed Ingestion</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? "Loading..." : (
              <>
                <span className="text-emerald-600 font-semibold">{activeCount} sources healthy</span>
                {errorCount > 0 && <> &middot; <span className="text-red-500 font-semibold">{errorCount} errored</span></>}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#0f172a] rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={triggerFullIngest}
            disabled={ingesting}
            className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {ingesting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Ingesting...</>
            ) : (
              <><Play className="w-4 h-4" /> Run All Sources</>
            )}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
            messageType === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
              : "bg-red-50 text-red-800 border border-red-100"
          }`}
        >
          {messageType === "success"
            ? <CheckCircle className="w-4 h-4 shrink-0" />
            : <XCircle className="w-4 h-4 shrink-0" />
          }
          {message}
        </div>
      )}

      {/* Source health grid */}
      <div className="bg-white rounded-2xl p-6 mb-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-5">Source Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sources.map((s) => (
            <div
              key={s.id}
              className={`flex items-center justify-between p-3.5 rounded-xl border ${
                s.hasError
                  ? "border-red-100 bg-red-50/50"
                  : s.active
                  ? "border-gray-100 bg-gray-50/50"
                  : "border-gray-100 bg-white opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  s.hasError ? "bg-red-500" : s.active ? "bg-emerald-500" : "bg-gray-300"
                }`} />
                <div>
                  <p className="font-semibold text-sm text-[#0f172a]">{s.name}</p>
                  {s.hasError && (
                    <p className="text-xs text-red-500 mt-0.5">{s.errorMessage}</p>
                  )}
                  {!s.hasError && s.lastSuccessfulFetch && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Last: {formatDate(s.lastSuccessfulFetch)}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-sm font-bold text-[#0f172a] tabular-nums">
                {s.articleCount.toLocaleString()}
                <span className="text-xs font-normal text-gray-400 ml-1">arts.</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400">Recent Ingestion Logs</h2>
        </div>
        {logs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">No ingestion logs yet. Run an ingestion to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/60">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Source</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Result</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Duration</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {log.status === "success" ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      )}
                      <span className="font-semibold text-[#0f172a]">{log.source.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {log.status === "success" ? (
                      <span className="text-emerald-600 font-medium">
                        +{log.articlesNew} new &middot; {log.articlesDupe} dupes
                        {log.articlesErr > 0 && <> &middot; <span className="text-red-500">{log.articlesErr} err</span></>}
                      </span>
                    ) : (
                      <span className="text-red-500 text-xs">{log.message}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right text-gray-400 tabular-nums text-xs">
                    {log.duration ? `${(log.duration / 1000).toFixed(1)}s` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right text-gray-400 text-xs tabular-nums whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
