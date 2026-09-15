import prisma from "@/lib/prisma";
import Link from "next/link";
import { Newspaper, MessageSquare, Rss, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalArticles,
    totalSources,
    activeSources,
    pendingOpinions,
    totalViews,
    recentArticles,
    recentLogs,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.newsSource.count(),
    prisma.newsSource.count({ where: { active: true } }),
    prisma.opinionSubmission.count({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    }),
    prisma.article.aggregate({ _sum: { viewCount: true } }),
    prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { source: { select: { name: true } } },
    }),
    prisma.ingestionLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { source: { select: { name: true } } },
    }),
  ]);

  const stats = [
    {
      label: "Total Articles",
      value: totalArticles,
      icon: Newspaper,
      href: "/admin/articles",
    },
    {
      label: "News Sources",
      value: `${activeSources}/${totalSources}`,
      icon: Rss,
      href: "/admin/sources",
    },
    {
      label: "Pending Opinions",
      value: pendingOpinions,
      icon: MessageSquare,
      href: "/admin/opinions",
    },
    {
      label: "Total Views",
      value: totalViews._sum.viewCount || 0,
      icon: Eye,
      href: "/admin/articles",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow no-underline"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent articles */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="font-bold text-lg mb-4">Recent Articles</h2>
          {recentArticles.length === 0 ? (
            <p className="text-gray-500 text-sm">No articles yet.</p>
          ) : (
            <div className="space-y-3">
              {recentArticles.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between gap-2 text-sm"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="font-medium text-gray-900 hover:text-blue-600 no-underline line-clamp-2"
                    >
                      {a.title}
                    </Link>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {a.source.name}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {a.viewCount} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent ingestion logs */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="font-bold text-lg mb-4">Ingestion Logs</h2>
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 text-sm">No ingestion logs yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {log.source.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {log.status === "success" ? (
                        <span className="text-green-600">
                          +{log.articlesNew} new, {log.articlesDupe} dupes
                        </span>
                      ) : (
                        <span className="text-red-600">{log.message}</span>
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {log.duration ? `${(log.duration / 1000).toFixed(1)}s` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
