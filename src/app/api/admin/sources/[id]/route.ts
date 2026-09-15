import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const source = await prisma.newsSource.findUnique({ where: { id } });

  if (!source) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ source });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const allowedFields = ["name", "website", "rssUrl", "description", "active"];
  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      data[field] = body[field];
    }
  }

  const source = await prisma.newsSource.update({
    where: { id },
    data,
  });

  return NextResponse.json({ source });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Delete related records
  const articles = await prisma.article.findMany({
    where: { sourceId: id },
    select: { id: true },
  });
  const articleIds = articles.map((a) => a.id);

  if (articleIds.length > 0) {
    await prisma.articleView.deleteMany({
      where: { articleId: { in: articleIds } },
    });
    await prisma.externalClick.deleteMany({
      where: { articleId: { in: articleIds } },
    });
    await prisma.article.deleteMany({ where: { sourceId: id } });
  }

  await prisma.ingestionLog.deleteMany({ where: { sourceId: id } });
  await prisma.newsSource.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
