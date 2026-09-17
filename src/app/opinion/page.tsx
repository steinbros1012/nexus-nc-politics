import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { PenLine } from "lucide-react";

export const metadata: Metadata = {
  title: "Opinion",
  description:
    "Editorials, op-eds, and letters to the editor about North Carolina politics and policy.",
};

export const dynamic = "force-dynamic";

export default async function OpinionPage() {
  const [editorials, letters] = await Promise.all([
    prisma.opinionSubmission.findMany({
      where: { status: "PUBLISHED", type: "EDITORIAL" },
      orderBy: { publishedAt: "desc" },
      take: 20,
    }),
    prisma.opinionSubmission.findMany({
      where: { status: "PUBLISHED", type: "LETTER" },
      orderBy: { publishedAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-5 bg-[#b91c1c] rounded-full" />
            <h1 className="text-2xl font-extrabold text-[#0f172a] uppercase tracking-wide">
              Opinion
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-4 pl-0.5">
            Editorials, op-eds, and letters to the editor about North Carolina
            politics and policy.
          </p>
        </div>
        <Link
          href="/submit-opinion"
          className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors no-underline shrink-0"
        >
          <PenLine className="w-4 h-4" />
          Submit Your Opinion
        </Link>
      </div>

      {editorials.length === 0 && letters.length === 0 && (
        <div className="py-20 text-center">
          <PenLine className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#0f172a] font-semibold mb-1">No published opinions yet</p>
          <p className="text-gray-400 text-sm mb-5">
            Be the first to share your perspective on NC politics.
          </p>
          <Link
            href="/submit-opinion"
            className="inline-flex items-center gap-2 bg-[#b91c1c] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors no-underline"
          >
            Submit an Opinion
          </Link>
        </div>
      )}

      {editorials.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#b91c1c]">
              Editorials &amp; Op-Eds
            </span>
          </div>
          <div className="space-y-0">
            {editorials.map((op) => (
              <article
                key={op.id}
                className="group border-b border-gray-100 py-5 last:border-0"
              >
                <div className="flex gap-4">
                  <div className="w-0.5 bg-[#b91c1c] rounded-full shrink-0 self-stretch" />
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#0f172a] mb-1.5 leading-snug">
                      <Link
                        href={`/opinion/${op.slug}`}
                        className="text-[#0f172a] hover:text-link no-underline transition-colors"
                      >
                        {op.headline}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                      <span className="font-medium text-gray-600">
                        {op.firstName} {op.lastName}
                      </span>
                      {op.organization && (
                        <span className="text-gray-300">&middot;</span>
                      )}
                      {op.organization && (
                        <span>{op.organization}</span>
                      )}
                      {op.city && (
                        <>
                          <span className="text-gray-300">&middot;</span>
                          <span>{op.city}, {op.state}</span>
                        </>
                      )}
                      {op.publishedAt && (
                        <>
                          <span className="text-gray-300">&middot;</span>
                          <time className="text-xs">{formatDate(op.publishedAt)}</time>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {letters.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Letters to the Editor
            </span>
          </div>
          <div className="space-y-0">
            {letters.map((op) => (
              <article
                key={op.id}
                className="group border-b border-gray-100 py-4 last:border-0"
              >
                <div className="flex gap-4">
                  <div className="w-0.5 bg-gray-200 rounded-full shrink-0 self-stretch" />
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#0f172a] mb-1 leading-snug">
                      <Link
                        href={`/opinion/${op.slug}`}
                        className="text-[#0f172a] hover:text-link no-underline transition-colors"
                      >
                        {op.headline}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-400">
                      <span className="font-medium">
                        {op.firstName} {op.lastName}
                      </span>
                      {op.city && <><span>&middot;</span><span>{op.city}</span></>}
                      {op.publishedAt && (
                        <><span>&middot;</span><time>{formatDate(op.publishedAt)}</time></>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
