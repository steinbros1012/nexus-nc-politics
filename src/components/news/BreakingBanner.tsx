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
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Breaking
          </span>
        </div>
        <div className="w-px h-4 bg-white/30 shrink-0" />
        <div className="overflow-hidden whitespace-nowrap">
          {articles.map((article, i) => (
            <span key={article.slug}>
              {i > 0 && (
                <span className="mx-3 text-white/40">&bull;</span>
              )}
              <Link
                href={`/article/${article.slug}`}
                className="text-sm font-medium text-white hover:text-white/80 no-underline transition-colors"
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
