import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Clock, MapPin, Tag, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import ArticleCardSmall from "@/components/news/ArticleCardSmall";
import ViewTracker from "@/components/ViewTracker";
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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ViewTracker articleId={article.id} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-link no-underline text-gray-400">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        {article.category && (
          <>
            <Link
              href={`/${article.category.slug}`}
              className="hover:text-link no-underline text-gray-400"
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
          <span className="bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wide">
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
      <h1 className="text-3xl md:text-[2.5rem] font-extrabold leading-[1.15] mb-5 text-[#0f172a] tracking-tight max-w-3xl">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
        <span className="font-semibold text-foreground uppercase tracking-wide text-xs">
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
      <div className="flex items-start gap-3 bg-[#f8fafc] border border-gray-100 rounded-lg px-4 py-3.5 mb-8">
        <div className="w-1 h-full min-h-[1.5rem] bg-[#1d4ed8]/30 rounded-full shrink-0 self-stretch" />
        <p className="text-sm text-gray-500 leading-relaxed">
          Originally published by{" "}
          <span className="font-semibold text-[#0f172a]">{article.source.name}</span>.
          {" "}The summary below is provided for informational purposes.
          Read the full article on their website.
        </p>
      </div>

      {/* Summary */}
      {(article.summary || article.aiSummary) && (
        <div className="max-w-[720px] mb-10">
          <p className="text-lg leading-[1.7] text-foreground">
            {article.aiSummary || article.summary}
          </p>
        </div>
      )}

      {/* CTA: Read Full Story */}
      <div className="bg-section-bg rounded-lg p-8 mb-10 text-center">
        <p className="text-sm text-gray-400 mb-4">
          Read the complete story on the original publisher&apos;s website
        </p>
        <a
          href={`/api/track/click/${article.id}?url=${encodeURIComponent(article.originalUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-gray-800 transition-colors no-underline"
        >
          Read the Full Story at {article.source.name}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-10">
          <Tag className="w-4 h-4 text-gray-400" />
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="text-sm bg-gray-50 text-gray-500 px-3 py-1 rounded-full hover:bg-gray-100 no-underline transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-gray-100 pt-10">
          <h2 className="text-lg font-bold mb-5 text-[#0f172a] uppercase tracking-wide">
            Related Articles
          </h2>
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
