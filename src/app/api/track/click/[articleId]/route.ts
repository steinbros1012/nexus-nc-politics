import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    // Track click
    await prisma.article.update({
      where: { id: articleId },
      data: { clickCount: { increment: 1 } },
    });

    await prisma.externalClick.create({
      data: {
        articleId,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0] || null,
        userAgent: req.headers.get("user-agent")?.slice(0, 255) || null,
      },
    });

    return NextResponse.redirect(url);
  } catch {
    // Fallback: redirect to url param if available
    const url = req.nextUrl.searchParams.get("url");
    if (url) return NextResponse.redirect(url);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
