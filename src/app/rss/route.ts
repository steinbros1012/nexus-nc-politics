import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const PUBLICATION_NAME =
  process.env.NEXT_PUBLIC_PUBLICATION_NAME || "NC Politics";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ncpolitics.com";

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { isHidden: false },
    include: {
      source: { select: { name: true } },
      category: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const items = articles
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${BASE_URL}/article/${a.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/article/${a.slug}</guid>
      <description><![CDATA[${a.summary || ""}]]></description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <source url="${a.originalUrl}">${a.source.name}</source>
      ${a.category ? `<category>${a.category.name}</category>` : ""}
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${PUBLICATION_NAME}</title>
    <link>${BASE_URL}</link>
    <description>North Carolina Political News Aggregation</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
