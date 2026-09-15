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
        <Link href={`/article/${article.slug}`}>
          <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden bg-[#0f172a] flex items-center justify-center">
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* NC wordmark / publication badge */}
            <div className="relative z-10 text-center px-8">
              <div className="text-white/20 text-8xl font-black tracking-tighter leading-none select-none mb-4">
                NC
              </div>
              <div className="w-16 h-px bg-[#dc2626] mx-auto mb-4" />
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">
                North Carolina Politics
              </p>
            </div>
            {/* Bottom gradient for text legibility */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f172a] to-transparent" />
          </div>
        </Link>
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
