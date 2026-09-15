import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ArticleCard from "@/components/news/ArticleCard";
import SectionHeader from "@/components/news/SectionHeader";
import type { Metadata } from "next";

interface RegionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = await prisma.region.findUnique({ where: { slug } });
  return {
    title: region ? `${region.name} News` : "Region Not Found",
  };
}

export const dynamic = "force-dynamic";

export default async function RegionPage({ params }: RegionPageProps) {
  const { slug } = await params;
  const region = await prisma.region.findUnique({
    where: { slug },
    include: { markets: { orderBy: { name: "asc" } } },
  });

  if (!region) notFound();

  const articles = await prisma.article.findMany({
    where: { isHidden: false, regionId: region.id },
    include: {
      source: { select: { name: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 30,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SectionHeader title={`${region.name} News`} />
      {region.description && (
        <p className="text-muted mb-4">{region.description}</p>
      )}

      {region.markets.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {region.markets.map((m) => (
            <a
              key={m.id}
              href={`/market/${m.slug}`}
              className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 no-underline transition-colors"
            >
              {m.name}
            </a>
          ))}
        </div>
      )}

      {articles.length === 0 ? (
        <p className="text-muted text-center py-12">
          No articles found for this region yet.
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
