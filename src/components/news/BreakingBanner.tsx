import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface BreakingBannerProps {
  articles: Array<{
    slug: string;
    title: string;
  }>;
}

export default function BreakingBanner({ articles }: BreakingBannerProps) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-accent text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Breaking
          </span>
        </div>
        <div className="overflow-hidden whitespace-nowrap">
          {articles.map((article, i) => (
            <span key={article.slug}>
              {i > 0 && (
                <span className="mx-3 text-red-300">&bull;</span>
              )}
              <Link
                href={`/article/${article.slug}`}
                className="text-sm font-medium text-white hover:text-red-100 no-underline transition-colors"
              >
                {article.title}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
