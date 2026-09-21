import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import DeleteOpinionButton from "./DeleteOpinionButton";

export const dynamic = "force-dynamic";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  SUBMITTED:          { label: "Submitted",         color: "#1d4ed8", bg: "#eff6ff" },
  UNDER_REVIEW:       { label: "Under Review",      color: "#7c3aed", bg: "#f5f3ff" },
  CHANGES_REQUESTED:  { label: "Changes Requested", color: "#b45309", bg: "#fffbeb" },
  APPROVED:           { label: "Approved",          color: "#065f46", bg: "#ecfdf5" },
  PUBLISHED:          { label: "Published",         color: "#0f172a", bg: "#f1f5f9" },
  REJECTED:           { label: "Rejected",          color: "#b91c1c", bg: "#fef2f2" },
};

export default async function AdminOpinionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  const currentStatus = statusFilter || "SUBMITTED";

  const [opinions, counts] = await Promise.all([
    prisma.opinionSubmission.findMany({
      where: { status: currentStatus as never },
      orderBy: { createdAt: "desc" },
    }),
    prisma.opinionSubmission.groupBy({ by: ["status"], _count: true }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count]));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Opinion Submissions</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Review, approve, and publish submitted editorials and letters.
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => {
          const count = countMap[val] || 0;
          const active = currentStatus === val;
          return (
            <a
              key={val}
              href={`/admin/opinions?status=${val}`}
              className="no-underline"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={
                  active
                    ? { background: cfg.color, color: "#fff" }
                    : { background: "#fff", color: "#6b7280", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                }
              >
                {cfg.label}
                {count > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-bold tabular-nums"
                    style={
                      active
                        ? { background: "rgba(255,255,255,0.25)", color: "#fff" }
                        : { background: cfg.bg, color: cfg.color }
                    }
                  >
                    {count}
                  </span>
                )}
              </span>
            </a>
          );
        })}
      </div>

      {opinions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <p className="text-gray-400 font-medium">No {STATUS_CONFIG[currentStatus]?.label.toLowerCase()} submissions.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {opinions.map((op, i) => {
            const cfg = op.type === "EDITORIAL"
              ? { label: "Editorial", color: "#7c3aed", bg: "#f5f3ff" }
              : { label: "Letter", color: "#1d4ed8", bg: "#eff6ff" };
            return (
              <div
                key={op.id}
                className={`flex items-start justify-between gap-4 px-6 py-5 hover:bg-gray-50/60 transition-colors ${i !== 0 ? "border-t border-gray-100" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0f172a] mb-1 leading-snug">{op.headline}</h3>
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-gray-400">
                    <span className="font-medium text-gray-600">{op.firstName} {op.lastName}</span>
                    {op.email && <><span>&middot;</span><span>{op.email}</span></>}
                    {op.city && <><span>&middot;</span><span>{op.city}, {op.state}</span></>}
                    <span>&middot;</span>
                    <span>Submitted {formatDate(op.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/opinions/${op.id}/review`}
                    className="inline-flex items-center px-4 py-2 bg-[#0f172a] text-white text-xs font-semibold rounded-xl hover:bg-gray-800 no-underline transition-colors"
                  >
                    Review
                  </Link>
                  <DeleteOpinionButton id={op.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
