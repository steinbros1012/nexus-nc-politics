import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkText?: string;
}

export default function SectionHeader({
  title,
  href,
  linkText = "See All",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b-2 border-header-bg pb-2 mb-6">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-link hover:underline no-underline font-medium"
        >
          {linkText}
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
