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
}

export default function ArticleCardSmall({
  article,
  index,
}: ArticleCardSmallProps) {
  return (
    <article className="flex gap-3 py-3 border-b border-border last:border-0">
      {typeof index === "number" && (
        <span className="text-3xl font-bold text-gray-200 leading-none min-w-[2rem]">
          {index + 1}
        </span>
      )}
      <div className="min-w-0">
        <h4 className="font-semibold text-sm leading-snug mb-1">
          <Link
            href={`/article/${article.slug}`}
            className="text-foreground hover:text-link no-underline transition-colors"
          >
            {article.title}
          </Link>
        </h4>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{article.source.name}</span>
          <span>&middot;</span>
          <time>{formatRelativeTime(article.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
