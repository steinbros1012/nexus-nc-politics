import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOpinionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;

  const statusTabs = [
    { label: "Submitted", value: "SUBMITTED" },
    { label: "Under Review", value: "UNDER_REVIEW" },
    { label: "Changes Requested", value: "CHANGES_REQUESTED" },
    { label: "Approved", value: "APPROVED" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  const currentStatus = statusFilter || "SUBMITTED";

  const opinions = await prisma.opinionSubmission.findMany({
    where: { status: currentStatus as never },
    orderBy: { createdAt: "desc" },
  });

  const counts = await prisma.opinionSubmission.groupBy({
    by: ["status"],
    _count: true,
  });

  const countMap = Object.fromEntries(
    counts.map((c) => [c.status, c._count])
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Opinion Submissions</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {statusTabs.map((tab) => (
          <a
            key={tab.value}
            href={`/admin/opinions?status=${tab.value}`}
            className={`px-3 py-2 text-sm rounded no-underline transition-colors ${
              currentStatus === tab.value
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}{" "}
            {countMap[tab.value] ? (
              <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full ml-1">
                {countMap[tab.value]}
              </span>
            ) : null}
          </a>
        ))}
      </div>

      {opinions.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No {currentStatus.toLowerCase().replace("_", " ")} opinions.
        </p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {opinions.map((op) => (
            <div
              key={op.id}
              className="px-5 py-4 hover:bg-gray-50 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${
                      op.type === "EDITORIAL"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {op.type}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{op.headline}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {op.firstName} {op.lastName}
                  {op.email ? ` (${op.email})` : ""}
                  {op.city ? ` - ${op.city}, ${op.state}` : ""}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Submitted {formatDate(op.createdAt)}
                </p>
              </div>
              <Link
                href={`/admin/opinions/${op.id}/review`}
                className="shrink-0 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 no-underline"
              >
                Review
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
