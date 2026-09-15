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
    <article className="group bg-white rounded-lg overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-200">
      {article.imageUrl && (
        <Link href={`/article/${article.slug}`}>
          <div className="aspect-video overflow-hidden bg-gray-50">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </Link>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2.5">
          {article.isBreaking && (
            <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
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
        <h3 className="font-bold text-[1.05rem] leading-snug mb-2 text-[#0f172a]">
          <Link
            href={`/article/${article.slug}`}
            className="text-[#0f172a] hover:text-link no-underline transition-colors"
          >
            {article.title}
          </Link>
        </h3>
        {article.summary && (
          <p className="text-muted text-sm line-clamp-2 mb-3 leading-relaxed">
            {article.summary}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-gray-100">
          <span className="uppercase tracking-wide font-medium text-[10px] text-gray-400">
            {article.source.name}
          </span>
          <time className="text-gray-400">{formatRelativeTime(article.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
