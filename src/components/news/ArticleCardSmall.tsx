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
    <article className="flex gap-4 py-3.5 border-b border-gray-100 last:border-0">
      {typeof index === "number" && (
        <span className="text-2xl font-extrabold text-gray-200 leading-none min-w-[1.75rem] tabular-nums">
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
