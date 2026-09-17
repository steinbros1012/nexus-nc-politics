import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Plus, CheckCircle, XCircle, Minus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSourcesPage() {
  const sources = await prisma.newsSource.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
  });

  const active = sources.filter((s) => s.active && !s.hasError).length;
  const errored = sources.filter((s) => s.hasError).length;
  const inactive = sources.filter((s) => !s.active).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">News Sources</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <span className="text-emerald-600 font-semibold">{active} active</span>
            {errored > 0 && <> &middot; <span className="text-red-500 font-semibold">{errored} errored</span></>}
            {inactive > 0 && <> &middot; <span className="text-gray-400">{inactive} inactive</span></>}
          </p>
        </div>
        <Link
          href="/admin/sources/new"
          className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors no-underline"
        >
          <Plus className="w-4 h-4" />
          Add Source
        </Link>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-400 text-xs uppercase tracking-widest">Source</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-400 text-xs uppercase tracking-widest">Status</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-400 text-xs uppercase tracking-widest">Articles</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-400 text-xs uppercase tracking-widest">Last Fetch</th>
              <th className="text-right px-5 py-3.5 font-semibold text-gray-400 text-xs uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sources.map((source) => (
              <tr key={source.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-semibold text-[#0f172a]">{source.name}</p>
                  {source.rssUrl && (
                    <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">{source.rssUrl}</p>
                  )}
                  {source.hasError && source.errorMessage && (
                    <p className="text-xs text-red-500 mt-1">{source.errorMessage}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  {source.hasError ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                      <XCircle className="w-3 h-3" /> Error
                    </span>
                  ) : source.active ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      <Minus className="w-3 h-3" /> Inactive
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="font-semibold text-[#0f172a] tabular-nums">{source.articleCount.toLocaleString()}</span>
                </td>
                <td className="px-5 py-4 text-gray-500 text-xs">
                  {source.lastSuccessfulFetch ? formatDate(source.lastSuccessfulFetch) : (
                    <span className="text-gray-300">Never</span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/sources/${source.id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-[#1d4ed8] bg-blue-50 hover:bg-blue-100 rounded-lg no-underline transition-colors"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
