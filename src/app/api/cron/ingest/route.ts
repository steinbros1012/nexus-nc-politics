import { NextRequest, NextResponse } from "next/server";
import { ingestAllSources } from "@/lib/ingest";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await ingestAllSources();
    const totalNew = results.reduce((sum, r) => sum + r.articlesNew, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.articlesErr, 0);

    return NextResponse.json({
      success: true,
      totalNew,
      totalErrors,
      sources: results.length,
      results,
    });
  } catch {
    return NextResponse.json(
      { error: "Ingestion failed" },
      { status: 500 }
    );
  }
}
