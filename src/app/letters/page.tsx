import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import SectionHeader from "@/components/news/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Letters to the Editor",
  description: "Letters from readers about North Carolina politics and policy.",
};

export const dynamic = "force-dynamic";

export default async function LettersPage() {
  const letters = await prisma.opinionSubmission.findMany({
    where: { status: "PUBLISHED", type: "LETTER" },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SectionHeader title="Letters to the Editor" />
      <p className="text-muted mb-6">
        Letters from readers about North Carolina politics, policy, and
        governance.
      </p>

      <Link
        href="/submit-opinion"
        className="inline-block bg-accent text-white px-5 py-2 rounded font-medium hover:bg-red-700 transition-colors no-underline mb-8"
      >
        Submit a Letter
      </Link>

      {letters.length === 0 ? (
        <p className="text-muted text-center py-12">
          No letters published yet.
        </p>
      ) : (
        <div className="space-y-6">
          {letters.map((letter) => (
            <article
              key={letter.id}
              className="border-b border-border pb-6"
            >
              <h3 className="text-lg font-bold mb-1">
                <Link
                  href={`/opinion/${letter.slug}`}
                  className="text-foreground hover:text-link no-underline"
                >
                  {letter.headline}
                </Link>
              </h3>
              <p className="text-sm text-muted">
                {letter.firstName} {letter.lastName}
                {letter.city ? `, ${letter.city}` : ""}
                {letter.publishedAt
                  ? ` | ${formatDate(letter.publishedAt)}`
                  : ""}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
