import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  politics: "bg-blue-50 text-blue-700",
  elections: "bg-red-50 text-red-700",
  legislature: "bg-purple-50 text-purple-700",
  government: "bg-indigo-50 text-indigo-700",
  courts: "bg-amber-50 text-amber-800",
  education: "bg-emerald-50 text-emerald-700",
  healthcare: "bg-teal-50 text-teal-700",
  economy: "bg-orange-50 text-orange-700",
  environment: "bg-green-50 text-green-700",
  local: "bg-sky-50 text-sky-700",
  opinion: "bg-gray-100 text-gray-600",
  policy: "bg-violet-50 text-violet-700",
};

interface CategoryBadgeProps {
  name: string;
  slug: string;
  className?: string;
}

export default function CategoryBadge({
  name,
  slug,
  className,
}: CategoryBadgeProps) {
  const colorClass = CATEGORY_COLORS[slug] || "bg-gray-100 text-gray-600";

  return (
    <Link
      href={`/${slug}`}
      className={cn(
        "inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider no-underline hover:opacity-80 transition-opacity",
        colorClass,
        className
      )}
    >
      {name}
    </Link>
  );
}
