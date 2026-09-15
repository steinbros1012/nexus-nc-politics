import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

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
    ...(q
      ? { title: { contains: q, mode: "insensitive" as const } }
      : {}),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        source: { select: { name: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">
          Articles{" "}
          <span className="text-gray-400 font-normal text-lg">({total})</span>
        </h1>
      </div>

      {/* Search */}
      <form className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q || ""}
          placeholder="Search articles..."
          className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent text-sm bg-white"
        />
      </form>

      <div className="bg-white rounded-lg card-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-400 text-xs uppercase tracking-wide">
                Title
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-400 text-xs uppercase tracking-wide">
                Source
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-400 text-xs uppercase tracking-wide">
                Category
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-400 text-xs uppercase tracking-wide">
                Date
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-400 text-xs uppercase tracking-wide">
                Views
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-400 text-xs uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5 max-w-xs">
                  <div className="flex items-center gap-2">
                    {article.isBreaking && (
                      <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    )}
                    {article.isFeatured && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    )}
                    <span className="truncate font-medium text-[#0f172a]">
                      {article.title}
                    </span>
                    {article.isHidden && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium uppercase tracking-wide">
                        hidden
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-500">
                  {article.source.name}
                </td>
                <td className="px-4 py-3.5 text-gray-500">
                  {article.category?.name || "-"}
                </td>
                <td className="px-4 py-3.5 text-gray-500 tabular-nums">
                  {formatDate(article.publishedAt)}
                </td>
                <td className="px-4 py-3.5 text-right text-gray-500 tabular-nums">
                  {article.viewCount}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-link hover:underline text-sm no-underline font-medium"
                  >
                    Edit
                  </Link>
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
              className="px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 no-underline text-foreground text-sm font-medium transition-colors"
            >
              Previous
            </a>
          )}
          <span className="px-4 py-2 text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/admin/articles?page=${page + 1}${q ? `&q=${q}` : ""}`}
              className="px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 no-underline text-foreground text-sm font-medium transition-colors"
            >
              Next
            </a>
          )}
        </div>
      )}
    </div>
  );
}
