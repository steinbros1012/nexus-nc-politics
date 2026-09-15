import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSourcesPage() {
  const sources = await prisma.newsSource.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">News Sources ({sources.length})</h1>
        <Link
          href="/admin/sources/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 no-underline"
        >
          Add Source
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Articles
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Last Fetch
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sources.map((source) => (
              <tr key={source.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium">{source.name}</span>
                    {source.rssUrl && (
                      <p className="text-xs text-gray-400 truncate max-w-xs">
                        {source.rssUrl}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        source.hasError
                          ? "bg-red-500"
                          : source.active
                            ? "bg-green-500"
                            : "bg-gray-400"
                      }`}
                    />
                    <span className="text-gray-600">
                      {source.hasError
                        ? "Error"
                        : source.active
                          ? "Active"
                          : "Inactive"}
                    </span>
                  </div>
                  {source.hasError && source.errorMessage && (
                    <p className="text-xs text-red-500 mt-1 truncate max-w-xs">
                      {source.errorMessage}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {source.articleCount}
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {source.lastSuccessfulFetch
                    ? formatDate(source.lastSuccessfulFetch)
                    : "Never"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/sources/${source.id}/edit`}
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
    </div>
  );
}
