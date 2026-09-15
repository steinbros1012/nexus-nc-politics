import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  politics: "bg-blue-600 text-white",
  elections: "bg-red-600 text-white",
  legislature: "bg-purple-600 text-white",
  government: "bg-indigo-600 text-white",
  courts: "bg-amber-700 text-white",
  education: "bg-emerald-600 text-white",
  healthcare: "bg-teal-600 text-white",
  economy: "bg-orange-600 text-white",
  environment: "bg-green-600 text-white",
  local: "bg-sky-600 text-white",
  opinion: "bg-gray-700 text-white",
  policy: "bg-violet-600 text-white",
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
  const colorClass = CATEGORY_COLORS[slug] || "bg-gray-500 text-white";

  return (
    <Link
      href={`/${slug}`}
      className={cn(
        "inline-block px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide no-underline",
        colorClass,
        className
      )}
    >
      {name}
    </Link>
  );
}
