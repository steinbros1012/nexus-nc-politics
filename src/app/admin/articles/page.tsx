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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Articles ({total})</h1>
      </div>

      {/* Search */}
      <form className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={q || ""}
          placeholder="Search articles..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Title
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Source
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Category
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Date
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Views
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 max-w-xs">
                  <div className="flex items-center gap-2">
                    {article.isBreaking && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    )}
                    {article.isFeatured && (
                      <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                    )}
                    <span className="truncate font-medium">{article.title}</span>
                    {article.isHidden && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                        hidden
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {article.source.name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {article.category?.name || "-"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatDate(article.publishedAt)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {article.viewCount}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-blue-600 hover:underline text-sm no-underline"
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
        <div className="flex justify-center gap-2 mt-6">
          {page > 1 && (
            <a
              href={`/admin/articles?page=${page - 1}${q ? `&q=${q}` : ""}`}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 no-underline text-gray-700"
            >
              Previous
            </a>
          )}
          <span className="px-4 py-2 text-gray-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/admin/articles?page=${page + 1}${q ? `&q=${q}` : ""}`}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 no-underline text-gray-700"
            >
              Next
            </a>
          )}
        </div>
      )}
    </div>
  );
}
