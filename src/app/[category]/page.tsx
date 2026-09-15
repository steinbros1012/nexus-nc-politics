import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ArticleCard from "@/components/news/ArticleCard";
import SectionHeader from "@/components/news/SectionHeader";
import type { Metadata } from "next";

const VALID_CATEGORIES = [
  "politics",
  "elections",
  "legislature",
  "government",
  "courts",
  "education",
  "healthcare",
  "economy",
  "environment",
  "local",
  "policy",
];

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  if (!VALID_CATEGORIES.includes(slug)) return { title: "Not Found" };
  const cat = await prisma.category.findUnique({ where: { slug } });
  return {
    title: cat?.name || slug,
    description: cat?.description || `NC ${cat?.name || slug} news`,
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category: slug } = await params;
  const { page: pageParam } = await searchParams;

  if (!VALID_CATEGORIES.includes(slug)) notFound();

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const page = Math.max(1, parseInt(pageParam || "1", 10));
  const perPage = 20;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { isHidden: false, categoryId: category.id },
      include: {
        source: { select: { name: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.article.count({
      where: { isHidden: false, categoryId: category.id },
    }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SectionHeader title={category.name} />
      {category.description && (
        <p className="text-muted mb-8 -mt-2 max-w-2xl">{category.description}</p>
      )}

      {articles.length === 0 ? (
        <p className="text-gray-400 text-center py-16">
          No articles found in this category yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              {page > 1 && (
                <a
                  href={`/${slug}?page=${page - 1}`}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 no-underline text-foreground text-sm font-medium transition-colors"
                >
                  Previous
                </a>
              )}
              <span className="px-4 py-2 text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <a
                  href={`/${slug}?page=${page + 1}`}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 no-underline text-foreground text-sm font-medium transition-colors"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
