import prisma from "@/lib/prisma";
import ArticleCard from "@/components/news/ArticleCard";
import ArticleCardFeatured from "@/components/news/ArticleCardFeatured";
import ArticleCardSmall from "@/components/news/ArticleCardSmall";
import BreakingBanner from "@/components/news/BreakingBanner";
import SectionHeader from "@/components/news/SectionHeader";
import NewsletterSignup from "@/components/NewsletterSignup";
import Link from "next/link";

const articleInclude = {
  source: { select: { name: true } },
  category: { select: { name: true, slug: true } },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    breakingArticles,
    featuredArticle,
    latestArticles,
    politicsArticles,
    legislatureArticles,
    electionsArticles,
    mostViewed,
    publishedOpinions,
  ] = await Promise.all([
    prisma.article.findMany({
      where: { isBreaking: true, isHidden: false },
      select: { slug: true, title: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    // Prefer featured + has image, then featured, then just latest with image, then latest
    prisma.article.findFirst({
      where: { isHidden: false, isFeatured: true, NOT: { imageUrl: null } },
      include: articleInclude,
      orderBy: { publishedAt: "desc" },
    }).then(async (a) => {
      if (a) return a
      const withImage = await prisma.article.findFirst({
        where: { isHidden: false, NOT: { imageUrl: null } },
        include: articleInclude,
        orderBy: { publishedAt: "desc" },
      })
      if (withImage) return withImage
      return prisma.article.findFirst({
        where: { isHidden: false },
        include: articleInclude,
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      })
    }),
    prisma.article.findMany({
      where: { isHidden: false },
      include: articleInclude,
      orderBy: { publishedAt: "desc" },
      take: 21,
    }),
    prisma.article.findMany({
      where: {
        isHidden: false,
        category: { slug: { in: ["politics", "government"] } },
      },
      include: articleInclude,
      orderBy: { publishedAt: "desc" },
      take: 4,
    }),
    prisma.article.findMany({
      where: { isHidden: false, category: { slug: "legislature" } },
      include: articleInclude,
      orderBy: { publishedAt: "desc" },
      take: 4,
    }),
    prisma.article.findMany({
      where: { isHidden: false, category: { slug: "elections" } },
      include: articleInclude,
      orderBy: { publishedAt: "desc" },
      take: 4,
    }),
    prisma.article.findMany({
      where: { isHidden: false },
      include: articleInclude,
      orderBy: { viewCount: "desc" },
      take: 5,
    }),
    prisma.opinionSubmission.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  const secondaryArticles = latestArticles
    .filter((a) => a.id !== featuredArticle?.id)
    .slice(0, 3);
  const remainingLatest = latestArticles
    .filter(
      (a) =>
        a.id !== featuredArticle?.id &&
        !secondaryArticles.find((s) => s.id === a.id)
    )
    .slice(0, 12);

  return (
    <>
      <BreakingBanner articles={breakingArticles} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {featuredArticle && (
          <section className="mb-10">
            <ArticleCardFeatured article={featuredArticle} />
          </section>
        )}

        {secondaryArticles.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {secondaryArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <SectionHeader title="Latest News" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {remainingLatest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>

            {politicsArticles.length > 0 && (
              <section>
                <SectionHeader title="NC Politics" href="/politics" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {politicsArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {legislatureArticles.length > 0 && (
              <section>
                <SectionHeader
                  title="General Assembly"
                  href="/legislature"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {legislatureArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {electionsArticles.length > 0 && (
              <section>
                <SectionHeader title="Elections" href="/elections" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {electionsArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {publishedOpinions.length > 0 && (
              <section>
                <SectionHeader title="Opinion" href="/opinion" />
                <div className="space-y-4">
                  {publishedOpinions.map((op) => (
                    <article
                      key={op.id}
                      className="border-b border-border pb-4"
                    >
                      <span className="text-xs font-semibold uppercase text-muted">
                        {op.type === "EDITORIAL" ? "Editorial" : "Letter"}
                      </span>
                      <h3 className="font-bold text-lg mt-1">
                        <Link
                          href={`/opinion/${op.slug}`}
                          className="text-foreground hover:text-link no-underline"
                        >
                          {op.headline}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted mt-1">
                        By {op.firstName} {op.lastName}
                        {op.city ? `, ${op.city}` : ""}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-8">
            <div>
              <SectionHeader title="Most Read" />
              <div>
                {mostViewed.map((article, i) => (
                  <ArticleCardSmall
                    key={article.id}
                    article={article}
                    index={i}
                  />
                ))}
              </div>
            </div>
            <NewsletterSignup />
          </aside>
        </div>
      </div>
    </>
  );
}
