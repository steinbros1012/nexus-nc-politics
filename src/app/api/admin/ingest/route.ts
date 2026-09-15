import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ingestAllSources } from "@/lib/ingest";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [logs, sources] = await Promise.all([
    prisma.ingestionLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { source: { select: { name: true } } },
    }),
    prisma.newsSource.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        active: true,
        hasError: true,
        errorMessage: true,
        lastSuccessfulFetch: true,
        lastAttemptedFetch: true,
        articleCount: true,
      },
    }),
  ]);

  return NextResponse.json({ logs, sources });
}

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await ingestAllSources();
    return NextResponse.json({ success: true, results });
  } catch {
    return NextResponse.json(
      { error: "Ingestion failed" },
      { status: 500 }
    );
  }
}
