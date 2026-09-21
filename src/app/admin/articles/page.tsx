import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";
import DeleteArticleButton from "./DeleteArticleButton";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10));
  const perPage = 25;

  const where = {
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        source: { select: { name: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { viewCount: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Articles</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <span className="font-semibold text-[#0f172a] tabular-nums">{total.toLocaleString()}</span> total articles indexed
          </p>
        </div>
      </div>

      {/* Search */}
      <form className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent text-sm bg-white"
          />
        </div>
      </form>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-400 text-xs uppercase tracking-widest">Title</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-400 text-xs uppercase tracking-widest">Source</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-400 text-xs uppercase tracking-widest">Category</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-400 text-xs uppercase tracking-widest">Date</th>
              <th className="text-right px-5 py-3.5 font-semibold text-gray-400 text-xs uppercase tracking-widest">Views</th>
              <th className="text-right px-5 py-3.5 font-semibold text-gray-400 text-xs uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3.5 max-w-xs">
                  <div className="flex items-center gap-2">
                    {article.isBreaking && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] shrink-0" />
                    )}
                    {article.isFeatured && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    )}
                    <span className="truncate font-medium text-[#0f172a]">{article.title}</span>
                    {article.isHidden && (
                      <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide shrink-0">
                        hidden
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{article.source.name}</td>
                <td className="px-5 py-3.5">
                  {article.category ? (
                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {article.category.name}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-gray-400 text-xs tabular-nums whitespace-nowrap">
                  {formatDate(article.publishedAt)}
                </td>
                <td className="px-5 py-3.5 text-right font-semibold text-[#0f172a] tabular-nums">
                  {article.viewCount.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-[#1d4ed8] bg-blue-50 hover:bg-blue-100 rounded-lg no-underline transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteArticleButton id={article.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          {page > 1 && (
            <a
              href={`/admin/articles?page=${page - 1}${q ? `&q=${q}` : ""}`}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 no-underline text-[#0f172a] text-sm font-semibold transition-colors"
            >
              Previous
            </a>
          )}
          <span className="px-4 py-2 text-sm text-gray-400 tabular-nums">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/admin/articles?page=${page + 1}${q ? `&q=${q}` : ""}`}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 no-underline text-[#0f172a] text-sm font-semibold transition-colors"
            >
              Next
            </a>
          )}
        </div>
      )}
    </div>
  );
}
