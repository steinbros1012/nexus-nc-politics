import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";

interface ArticleCardSmallProps {
  article: {
    slug: string;
    title: string;
    publishedAt: Date | string;
    source: { name: string };
    category?: { name: string; slug: string } | null;
  };
  index?: number;
  isNew?: boolean;
}

export default function ArticleCardSmall({
  article,
  index,
  isNew,
}: ArticleCardSmallProps) {
  return (
    <article className="flex gap-4 py-3.5 border-b border-gray-100 last:border-0">
      {typeof index === "number" && (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-bold text-gray-400 shrink-0 mt-0.5 tabular-nums">
          {index + 1}
        </span>
      )}
      <div className="min-w-0">
        <h4 className="font-semibold text-sm leading-snug mb-1 text-[#0f172a]">
          <Link
            href={`/article/${article.slug}`}
            className="text-[#0f172a] hover:text-link no-underline transition-colors"
          >
            {article.title}
          </Link>
          {isNew && (
            <span className="ml-2 inline-block bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide align-middle">
              NEW
            </span>
          )}
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="uppercase tracking-wide text-[10px] font-medium">
            {article.source.name}
          </span>
          <span className="text-gray-300">&middot;</span>
          <time>{formatRelativeTime(article.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
