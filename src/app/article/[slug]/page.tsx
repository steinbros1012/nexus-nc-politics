import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Clock, MapPin, Tag, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import ArticleCardSmall from "@/components/news/ArticleCardSmall";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, summary: true, imageUrl: true },
  });
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.summary || undefined,
    openGraph: {
      title: article.title,
      description: article.summary || undefined,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      source: true,
      category: true,
      region: true,
      market: true,
    },
  });

  if (!article || article.isHidden) notFound();

  // Track view (fire and forget)
  prisma.article
    .update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  const relatedArticles = await prisma.article.findMany({
    where: {
      isHidden: false,
      id: { not: article.id },
      OR: [
        article.categoryId ? { categoryId: article.categoryId } : {},
        article.regionId ? { regionId: article.regionId } : {},
      ].filter((c) => Object.keys(c).length > 0),
    },
    include: {
      source: { select: { name: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 5,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-link no-underline text-muted">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        {article.category && (
          <>
            <Link
              href={`/${article.category.slug}`}
              className="hover:text-link no-underline text-muted"
            >
              {article.category.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-foreground truncate">{article.title}</span>
      </nav>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4">
        {article.isBreaking && (
          <span className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded uppercase">
            Breaking News
          </span>
        )}
        {article.category && (
          <CategoryBadge
            name={article.category.name}
            slug={article.category.slug}
          />
        )}
      </div>

      {/* Headline */}
      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6 pb-6 border-b border-border">
        <span className="font-medium text-foreground">
          {article.source.name}
        </span>
        {article.author && <span>By {article.author}</span>}
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(article.publishedAt)}
        </span>
        {(article.region || article.market) && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {article.market?.name || article.region?.name}
          </span>
        )}
      </div>

      {/* Image */}
      {article.imageUrl && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Attribution notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-blue-800">
          <strong>Source Attribution:</strong> This article was originally
          published by{" "}
          <strong>{article.source.name}</strong>. The summary below is
          provided for informational purposes. Click the link below to read
          the full story on the original publisher&apos;s website.
        </p>
      </div>

      {/* Summary */}
      {(article.summary || article.aiSummary) && (
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-lg leading-relaxed text-gray-700">
            {article.aiSummary || article.summary}
          </p>
        </div>
      )}

      {/* CTA: Read Full Story */}
      <div className="bg-section-bg border-2 border-header-bg rounded-lg p-6 mb-8 text-center">
        <p className="text-sm text-muted mb-3">
          Read the complete story on the original publisher&apos;s website
        </p>
        <a
          href={`/api/track/click/${article.id}?url=${encodeURIComponent(article.originalUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-header-bg text-white px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors no-underline"
        >
          Read the Full Story at {article.source.name}
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Tag className="w-4 h-4 text-muted" />
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 no-underline transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-border pt-8">
          <h2 className="text-xl font-bold mb-4">Related Articles</h2>
          <div className="space-y-0">
            {relatedArticles.map((ra) => (
              <ArticleCardSmall key={ra.id} article={ra} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
