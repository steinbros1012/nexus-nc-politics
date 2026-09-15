import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface ArticleCardProps {
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

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group bg-card-bg border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {article.imageUrl && (
        <Link href={`/article/${article.slug}`}>
          <div className="aspect-video overflow-hidden bg-gray-100">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </Link>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {article.isBreaking && (
            <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded uppercase">
              Breaking
            </span>
          )}
          {article.category && (
            <CategoryBadge
              name={article.category.name}
              slug={article.category.slug}
            />
          )}
        </div>
        <h3 className="font-bold text-lg leading-tight mb-2">
          <Link
            href={`/article/${article.slug}`}
            className="text-foreground hover:text-link no-underline transition-colors"
          >
            {article.title}
          </Link>
        </h3>
        {article.summary && (
          <p className="text-muted text-sm line-clamp-2 mb-3">
            {article.summary}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{article.source.name}</span>
          <time>{formatRelativeTime(article.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
