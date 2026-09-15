import Parser from "rss-parser";
import prisma from "./prisma";
import { classifyArticle } from "./classifier";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
      ["enclosure", "enclosure", { keepArray: false }],
    ],
  },
});

function extractImage(item: Record<string, unknown>): string | null {
  const mediaContent = item.mediaContent as
    | { $?: { url?: string } }
    | undefined;
  const mediaThumbnail = item.mediaThumbnail as
    | { $?: { url?: string } }
    | undefined;
  const enclosure = item.enclosure as
    | { url?: string; type?: string }
    | undefined;

  if (mediaContent?.$?.url) return mediaContent.$.url;
  if (mediaThumbnail?.$?.url) return mediaThumbnail.$.url;
  if (enclosure?.url && enclosure.type?.startsWith("image/"))
    return enclosure.url;

  const content = String(item.content || item["content:encoded"] || "");
  const contentMatch = content.match(/<img[^>]+src="([^"]+)"/);
  if (contentMatch) return contentMatch[1];

  return null;
}

function generateSlug(title: string, date: Date): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);

  const suffix =
    date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  return `${base}-${suffix}`;
}

function ensureUniqueSlug(slug: string): string {
  return `${slug}-${Math.random().toString(36).slice(2, 7)}`;
}

export interface IngestResult {
  sourceId: string;
  sourceName: string;
  articlesNew: number;
  articlesDupe: number;
  articlesErr: number;
  error?: string;
  duration: number;
}

export async function ingestSource(sourceId: string): Promise<IngestResult> {
  const start = Date.now();
  let articlesNew = 0;
  let articlesDupe = 0;
  let articlesErr = 0;

  const source = await prisma.newsSource.findUnique({
    where: { id: sourceId },
  });
  if (!source || !source.rssUrl) {
    return {
      sourceId,
      sourceName: source?.name || sourceId,
      articlesNew: 0,
      articlesDupe: 0,
      articlesErr: 0,
      error: "No RSS URL configured",
      duration: 0,
    };
  }

  await prisma.newsSource.update({
    where: { id: sourceId },
    data: { lastAttemptedFetch: new Date() },
  });

  const [categories, regions, markets] = await Promise.all([
    prisma.category.findMany({ select: { id: true, slug: true } }),
    prisma.region.findMany({ select: { id: true, slug: true } }),
    prisma.market.findMany({ select: { id: true, slug: true } }),
  ]);

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.slug, c.id])
  );
  const regionMap = Object.fromEntries(regions.map((r) => [r.slug, r.id]));
  const marketMap = Object.fromEntries(markets.map((m) => [m.slug, m.id]));

  try {
    const feed = await parser.parseURL(source.rssUrl);

    for (const item of feed.items || []) {
      try {
        const link = item.link || item.guid;
        if (!link) {
          articlesErr++;
          continue;
        }

        const exists = await prisma.article.findUnique({
          where: { originalUrl: link },
        });
        if (exists) {
          articlesDupe++;
          continue;
        }

        const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
        const title = item.title?.trim() || "Untitled";
        const summary =
          item.contentSnippet?.slice(0, 600) ||
          item.summary?.slice(0, 600) ||
          null;

        const classification = classifyArticle(title, summary);

        let slug = generateSlug(title, publishedAt);
        const slugExists = await prisma.article.findUnique({
          where: { slug },
        });
        if (slugExists) slug = ensureUniqueSlug(slug);

        await prisma.article.create({
          data: {
            title,
            slug,
            summary,
            originalUrl: link,
            imageUrl: extractImage(item as unknown as Record<string, unknown>),
            author: item.creator || (item as unknown as Record<string, string>).author || null,
            publishedAt,
            sourceId: source.id,
            categoryId: classification.categorySlug
              ? categoryMap[classification.categorySlug] || null
              : null,
            regionId: classification.regionSlug
              ? regionMap[classification.regionSlug] || null
              : null,
            marketId: classification.marketSlug
              ? marketMap[classification.marketSlug] || null
              : null,
            tags: classification.tags,
            aiClassified: false,
          },
        });

        articlesNew++;
      } catch {
        articlesErr++;
      }
    }

    await prisma.newsSource.update({
      where: { id: sourceId },
      data: {
        lastSuccessfulFetch: new Date(),
        hasError: false,
        errorMessage: null,
        articleCount: { increment: articlesNew },
      },
    });

    const duration = Date.now() - start;

    await prisma.ingestionLog.create({
      data: {
        sourceId: source.id,
        status: "success",
        message: `Imported ${articlesNew} new articles, ${articlesDupe} duplicates, ${articlesErr} errors`,
        articlesNew,
        articlesDupe,
        articlesErr,
        duration,
      },
    });

    return {
      sourceId,
      sourceName: source.name,
      articlesNew,
      articlesDupe,
      articlesErr,
      duration,
    };
  } catch (err: unknown) {
    const duration = Date.now() - start;
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error";

    await prisma.newsSource.update({
      where: { id: sourceId },
      data: { hasError: true, errorMessage },
    });

    await prisma.ingestionLog.create({
      data: {
        sourceId: source.id,
        status: "error",
        message: errorMessage,
        articlesNew: 0,
        articlesDupe: 0,
        articlesErr: 1,
        duration,
      },
    });

    return {
      sourceId,
      sourceName: source.name,
      articlesNew: 0,
      articlesDupe: 0,
      articlesErr: 1,
      error: errorMessage,
      duration,
    };
  }
}

export async function ingestAllSources(): Promise<IngestResult[]> {
  const sources = await prisma.newsSource.findMany({
    where: { active: true, NOT: { rssUrl: null } },
  });

  const results: IngestResult[] = [];
  for (const source of sources) {
    const result = await ingestSource(source.id);
    results.push(result);
  }

  return results;
}
