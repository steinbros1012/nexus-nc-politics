import { MetadataRoute } from "next";
import { db } from "@/lib/cache";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ncpolitics.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, regions, opinions] = await Promise.all([
    db.article.findMany({
      where: { isHidden: false },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
      take: 1000,
    }),
    db.category.findMany({ select: { slug: true } }),
    db.region.findMany({ select: { slug: true } }),
    db.opinionSubmission.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 1 },
    { url: `${BASE_URL}/opinion`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${BASE_URL}/search`, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/editorial-policy`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/submit-opinion`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${BASE_URL}/letters`, changeFrequency: "daily" as const, priority: 0.6 },
  ];

  const articlePages = articles.map((a) => ({
    url: `${BASE_URL}/article/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${BASE_URL}/${c.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const regionPages = regions.map((r) => ({
    url: `${BASE_URL}/region/${r.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  const opinionPages = opinions
    .filter((o) => o.slug)
    .map((o) => ({
      url: `${BASE_URL}/opinion/${o.slug}`,
      lastModified: o.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [...staticPages, ...categoryPages, ...regionPages, ...articlePages, ...opinionPages];
}
