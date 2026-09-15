import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ingestSource } from "@/lib/ingest";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ sourceId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sourceId } = await params;

  try {
    const result = await ingestSource(sourceId);
    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json(
      { error: "Ingestion failed" },
      { status: 500 }
    );
  }
}
