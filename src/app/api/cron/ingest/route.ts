import { NextRequest, NextResponse } from "next/server";
import { ingestAllSources } from "@/lib/ingest";
import prisma from "@/lib/prisma";

// Breaking news auto-expires after 24 hours
const BREAKING_EXPIRY_HOURS = 24;

async function expireBreakingNews() {
  const cutoff = new Date(Date.now() - BREAKING_EXPIRY_HOURS * 60 * 60 * 1000);
  const result = await prisma.article.updateMany({
    where: {
      isBreaking: true,
      publishedAt: { lt: cutoff },
    },
    data: { isBreaking: false },
  });
  return result.count;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [results, expiredBreaking] = await Promise.all([
      ingestAllSources(),
      expireBreakingNews(),
    ]);

    const totalNew = results.reduce((sum, r) => sum + r.articlesNew, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.articlesErr, 0);

    return NextResponse.json({
      success: true,
      totalNew,
      totalErrors,
      sources: results.length,
      expiredBreaking,
      results,
    });
  } catch {
    return NextResponse.json(
      { error: "Ingestion failed" },
      { status: 500 }
    );
  }
}
