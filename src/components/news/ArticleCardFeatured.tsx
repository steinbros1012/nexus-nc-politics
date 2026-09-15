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
    <article className="group relative bg-white rounded-lg overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-200">
      {article.imageUrl ? (
        <Link href={`/article/${article.slug}`}>
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-50">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
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
              <div className="text-white/15 text-8xl font-black tracking-tighter leading-none select-none mb-4">
                NC
              </div>
              <div className="w-16 h-px bg-accent mx-auto mb-4" />
              <p className="text-white/35 text-xs font-semibold uppercase tracking-widest">
                North Carolina Politics
              </p>
            </div>
            {/* Bottom gradient for text legibility */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f172a] to-transparent" />
          </div>
        </Link>
      )}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
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
        <h2 className="font-extrabold text-2xl md:text-[2rem] leading-tight mb-3 text-[#0f172a] tracking-tight">
          <Link
            href={`/article/${article.slug}`}
            className="text-[#0f172a] hover:text-link no-underline transition-colors"
          >
            {article.title}
          </Link>
        </h2>
        {article.summary && (
          <p className="text-muted text-base md:text-lg line-clamp-3 mb-5 leading-relaxed">
            {article.summary}
          </p>
        )}
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="uppercase tracking-wide font-medium text-[11px] text-gray-400">
            {article.source.name}
          </span>
          <span className="text-gray-300">&middot;</span>
          <time className="text-gray-400">{formatRelativeTime(article.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
