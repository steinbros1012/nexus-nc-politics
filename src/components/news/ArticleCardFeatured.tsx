import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface ArticleCardFeaturedProps {
  article: {
    slug: string;
    title: string;
    summary: string | null;
    imageUrl: string | null;
    publishedAt: Date | string;
    source: { name: string };
    category?: { name: string; slug: string } | null;
    isBreaking?: boolean;
  };
}

export default function ArticleCardFeatured({
  article,
}: ArticleCardFeaturedProps) {
  return (
    <article className="group relative bg-card-bg border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {article.imageUrl ? (
        <Link href={`/article/${article.slug}`}>
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-100">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>
      ) : (
        <div className="aspect-[16/9] md:aspect-[21/9] bg-gradient-to-br from-header-bg to-gray-700" />
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {article.isBreaking && (
            <span className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded uppercase animate-pulse">
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
        <h2 className="font-bold text-2xl md:text-3xl leading-tight mb-3">
          <Link
            href={`/article/${article.slug}`}
            className="text-foreground hover:text-link no-underline transition-colors"
          >
            {article.title}
          </Link>
        </h2>
        {article.summary && (
          <p className="text-muted text-base line-clamp-3 mb-4">
            {article.summary}
          </p>
        )}
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="font-medium">{article.source.name}</span>
          <span>&middot;</span>
          <time>{formatRelativeTime(article.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
