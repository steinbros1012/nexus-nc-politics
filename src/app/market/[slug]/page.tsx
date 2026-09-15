import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ArticleCard from "@/components/news/ArticleCard";
import SectionHeader from "@/components/news/SectionHeader";
import type { Metadata } from "next";

interface MarketPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: MarketPageProps): Promise<Metadata> {
  const { slug } = await params;
  const market = await prisma.market.findUnique({ where: { slug } });
  return {
    title: market ? `${market.name} Political News` : "Market Not Found",
  };
}

export const dynamic = "force-dynamic";

export default async function MarketPage({ params }: MarketPageProps) {
  const { slug } = await params;
  const market = await prisma.market.findUnique({
    where: { slug },
    include: { region: true },
  });

  if (!market) notFound();

  const articles = await prisma.article.findMany({
    where: { isHidden: false, marketId: market.id },
    include: {
      source: { select: { name: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 30,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SectionHeader title={`${market.name} Political News`} />

      {articles.length === 0 ? (
        <p className="text-muted text-center py-12">
          No articles found for {market.name} yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
