import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface OpinionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: OpinionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const opinion = await prisma.opinionSubmission.findUnique({
    where: { slug },
    select: { headline: true },
  });
  return { title: opinion?.headline || "Opinion" };
}

export const dynamic = "force-dynamic";

export default async function OpinionArticlePage({
  params,
}: OpinionPageProps) {
  const { slug } = await params;

  const opinion = await prisma.opinionSubmission.findUnique({
    where: { slug },
  });

  if (!opinion || opinion.status !== "PUBLISHED") notFound();

  // Track view
  prisma.opinionSubmission
    .update({
      where: { id: opinion.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-link no-underline text-muted">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          href="/opinion"
          className="hover:text-link no-underline text-muted"
        >
          Opinion
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground truncate">{opinion.headline}</span>
      </nav>

      <span className="text-xs font-bold uppercase tracking-wider text-accent">
        {opinion.type === "EDITORIAL" ? "Editorial" : "Letter to the Editor"}
      </span>

      <h1 className="text-3xl md:text-4xl font-bold leading-tight mt-2 mb-4">
        {opinion.headline}
      </h1>

      <div className="text-sm text-muted mb-6 pb-6 border-b border-border">
        <p>
          By{" "}
          <span className="font-medium text-foreground">
            {opinion.firstName} {opinion.lastName}
          </span>
          {opinion.titleRole && <>, {opinion.titleRole}</>}
          {opinion.organization && <>, {opinion.organization}</>}
        </p>
        {opinion.city && (
          <p>
            {opinion.city}, {opinion.state}
          </p>
        )}
        {opinion.publishedAt && (
          <time className="text-xs">
            Published {formatDate(opinion.publishedAt)}
          </time>
        )}
      </div>

      <article className="prose prose-lg max-w-none mb-8">
        {opinion.body.split(/\n\n+/).map((paragraph, i) => (
          paragraph.trim() ? <p key={i}>{paragraph.trim()}</p> : null
        ))}
      </article>

      {opinion.authorBio && (
        <div className="bg-section-bg rounded-lg p-4 mb-8 text-sm italic text-muted">
          {opinion.authorBio}
        </div>
      )}

      {opinion.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {opinion.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="border-t border-border pt-6 text-center">
        <p className="text-sm text-muted mb-3">
          Want to share your perspective on NC politics?
        </p>
        <Link
          href="/submit-opinion"
          className="inline-block bg-accent text-white px-6 py-3 rounded font-medium hover:bg-red-700 transition-colors no-underline"
        >
          Submit Your Opinion
        </Link>
      </div>
    </div>
  );
}
