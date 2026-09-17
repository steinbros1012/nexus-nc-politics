import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Newspaper,
  MessageSquare,
  Rss,
  Eye,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  href: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl p-6 no-underline overflow-hidden hover:shadow-lg transition-all duration-200"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18` }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
      <p className="text-[2rem] font-extrabold text-[#0f172a] leading-none tracking-tight mb-1 tabular-nums">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </Link>
  );
}

export default async function AdminDashboard() {
  const [
    totalArticles,
    totalSources,
    activeSources,
    pendingOpinions,
    publishedOpinions,
    totalViews,
    totalClicks,
    unreadMessages,
    totalMessages,
    todayArticles,
    recentArticles,
    recentLogs,
    topArticles,
  ] = await Promise.all([
    prisma.article.count({ where: { isHidden: false } }),
    prisma.newsSource.count(),
    prisma.newsSource.count({ where: { active: true } }),
    prisma.opinionSubmission.count({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    }),
    prisma.opinionSubmission.count({ where: { status: "PUBLISHED" } }),
    prisma.article.aggregate({ _sum: { viewCount: true } }),
    prisma.article.aggregate({ _sum: { clickCount: true } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.count(),
    prisma.article.count({
      where: {
        isHidden: false,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.article.findMany({
      where: { isHidden: false },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { source: { select: { name: true } }, category: { select: { name: true } } },
    }),
    prisma.ingestionLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { source: { select: { name: true } } },
    }),
    prisma.article.findMany({
      where: { isHidden: false },
      orderBy: { viewCount: "desc" },
      take: 5,
      include: { source: { select: { name: true } } },
    }),
  ]);

  const totalViewCount = totalViews._sum.viewCount || 0;
  const totalClickCount = totalClicks._sum.clickCount || 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">NC Politics Now — Admin Overview</p>
        </div>
        <Link
          href="/admin/ingestion"
          className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors no-underline"
        >
          <Activity className="w-4 h-4" />
          Run Ingestion
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Articles"
          value={totalArticles}
          sub={`+${todayArticles} today`}
          icon={Newspaper}
          href="/admin/articles"
          accent="#0f172a"
        />
        <StatCard
          label="Total Views"
          value={totalViewCount}
          sub={`${totalClickCount.toLocaleString()} outbound clicks`}
          icon={Eye}
          href="/admin/articles"
          accent="#1d4ed8"
        />
        <StatCard
          label="Pending Opinions"
          value={pendingOpinions}
          sub={`${publishedOpinions} published`}
          icon={MessageSquare}
          href="/admin/opinions"
          accent="#7c3aed"
        />
        <StatCard
          label="Unread Messages"
          value={unreadMessages}
          sub={`${totalMessages} total received`}
          icon={Mail}
          href="/admin/messages"
          accent="#b91c1c"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Rss className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#0f172a] tabular-nums">{activeSources}<span className="text-base font-medium text-gray-300">/{totalSources}</span></p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Active Sources</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#0f172a] tabular-nums">{todayArticles}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Articles Today</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#0f172a]">Every 2 Hours</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Auto-Ingest Schedule</p>
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top articles */}
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-sm uppercase tracking-widest text-gray-400">Top Articles</h2>
            <Link href="/admin/articles" className="text-xs text-link hover:underline no-underline font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {topArticles.map((a, i) => (
              <div key={a.id} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-300 shrink-0 tabular-nums mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/articles/${a.id}/edit`}
                    className="text-sm font-semibold text-[#0f172a] hover:text-link no-underline line-clamp-2 leading-snug"
                  >
                    {a.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-400">{a.source.name}</span>
                    <span className="text-gray-200">&middot;</span>
                    <span className="text-[11px] font-semibold text-[#1d4ed8]">{a.viewCount.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent articles */}
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-sm uppercase tracking-widest text-gray-400">Recently Ingested</h2>
            <Link href="/admin/articles" className="text-xs text-link hover:underline no-underline font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {recentArticles.map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                <div className="min-w-0">
                  <Link
                    href={`/admin/articles/${a.id}/edit`}
                    className="text-sm font-medium text-[#0f172a] hover:text-link no-underline line-clamp-2 leading-snug"
                  >
                    {a.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-400">{a.source.name}</span>
                    {a.category && (
                      <>
                        <span className="text-gray-200">&middot;</span>
                        <span className="text-[11px] text-gray-400">{a.category.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ingestion logs */}
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-sm uppercase tracking-widest text-gray-400">Ingestion Logs</h2>
            <Link href="/admin/ingestion" className="text-xs text-link hover:underline no-underline font-medium">Details</Link>
          </div>
          <div className="space-y-2.5">
            {recentLogs.length === 0 ? (
              <p className="text-gray-400 text-sm">No logs yet.</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 py-1">
                  {log.status === "success" ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0f172a] truncate">{log.source.name}</p>
                    <p className="text-[11px] mt-0.5">
                      {log.status === "success" ? (
                        <span className="text-emerald-600 font-medium">+{log.articlesNew} new &middot; {log.articlesDupe} dupes</span>
                      ) : (
                        <span className="text-red-500 truncate block">{log.message}</span>
                      )}
                    </p>
                  </div>
                  {log.duration && (
                    <span className="text-[10px] text-gray-300 shrink-0 tabular-nums">
                      {(log.duration / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Make the Activity icon available
function Activity({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
