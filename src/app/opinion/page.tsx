import prisma from "@/lib/prisma";
import Link from "next/link";
import SectionHeader from "@/components/news/SectionHeader";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SectionHeader title="Opinion" />
      <p className="text-muted mb-8">
        Editorials, op-eds, and letters to the editor about North Carolina
        politics and policy.
      </p>

      <div className="mb-6">
        <Link
          href="/submit-opinion"
          className="inline-block bg-accent text-white px-6 py-3 rounded font-medium hover:bg-red-700 transition-colors no-underline"
        >
          Submit Your Opinion
        </Link>
      </div>

      {editorials.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-bold uppercase tracking-wider text-muted border-b border-border pb-2 mb-6">
            Editorials &amp; Op-Eds
          </h2>
          <div className="space-y-6">
            {editorials.map((op) => (
              <article key={op.id} className="border-b border-border pb-6">
                <h3 className="text-xl font-bold mb-2">
                  <Link
                    href={`/opinion/${op.slug}`}
                    className="text-foreground hover:text-link no-underline"
                  >
                    {op.headline}
                  </Link>
                </h3>
                <p className="text-sm text-muted mb-2">
                  By {op.firstName} {op.lastName}
                  {op.organization ? `, ${op.organization}` : ""}
                  {op.city ? ` | ${op.city}, ${op.state}` : ""}
                </p>
                {op.publishedAt && (
                  <time className="text-xs text-muted">
                    {formatDate(op.publishedAt)}
                  </time>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {letters.length > 0 && (
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider text-muted border-b border-border pb-2 mb-6">
            Letters to the Editor
          </h2>
          <div className="space-y-6">
            {letters.map((op) => (
              <article key={op.id} className="border-b border-border pb-6">
                <h3 className="text-lg font-bold mb-1">
                  <Link
                    href={`/opinion/${op.slug}`}
                    className="text-foreground hover:text-link no-underline"
                  >
                    {op.headline}
                  </Link>
                </h3>
                <p className="text-sm text-muted">
                  {op.firstName} {op.lastName}
                  {op.city ? `, ${op.city}` : ""}
                  {op.publishedAt
                    ? ` | ${formatDate(op.publishedAt)}`
                    : ""}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {editorials.length === 0 && letters.length === 0 && (
        <p className="text-muted text-center py-12">
          No published opinions yet. Be the first to{" "}
          <Link href="/submit-opinion" className="text-link">
            submit yours
          </Link>
          .
        </p>
      )}
    </div>
  );
}
