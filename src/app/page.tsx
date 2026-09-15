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
      orderBy: [
        { isFeatured: "desc" },
        { isEditorsPick: "desc" },
        { publishedAt: "desc" },
      ],
      take: 5,
    }),
    prisma.opinionSubmission.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 6,
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

      <div className="max-w-7xl mx-auto px-4 py-10">
        {featuredArticle && (
          <section className="mb-12">
            <ArticleCardFeatured article={featuredArticle} />
          </section>
        )}

        {secondaryArticles.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {secondaryArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-14">
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
                <div className="space-y-0">
                  {publishedOpinions.map((op) => (
                    <article
                      key={op.id}
                      className={`border-b border-gray-100 py-4 first:pt-0 last:border-0 pl-4 hover:bg-gray-50 transition-colors rounded-r ${
                        op.type === "EDITORIAL"
                          ? "border-l-2 border-l-[#b91c1c]"
                          : "border-l-2 border-l-gray-300"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider ${
                          op.type === "EDITORIAL"
                            ? "text-[#b91c1c]"
                            : "text-gray-400"
                        }`}
                      >
                        {op.type === "EDITORIAL" ? "Opinion" : "Letter"}
                      </span>
                      <h3 className="font-bold text-base mt-1 text-[#0f172a]">
                        <Link
                          href={`/opinion/${op.slug}`}
                          className="text-[#0f172a] hover:text-link no-underline transition-colors"
                        >
                          {op.headline}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        By {op.firstName} {op.lastName}
                        {op.city ? `, ${op.city}` : ""}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-10">
            <div>
              <SectionHeader title="Editor's Picks" />
              <div>
                {mostViewed.map((article, i) => {
                  const publishedDate = new Date(article.publishedAt);
                  const isNew = Date.now() - publishedDate.getTime() < 48 * 60 * 60 * 1000;
                  return (
                    <ArticleCardSmall
                      key={article.id}
                      article={article}
                      index={i}
                      isNew={isNew}
                    />
                  );
                })}
              </div>
            </div>
            <NewsletterSignup />
          </aside>
        </div>
      </div>
    </>
  );
}
