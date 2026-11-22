import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ opinionId: string }> }
) {
  try {
    const { opinionId } = await params;
    await prisma.opinionSubmission.update({
      where: { id: opinionId, status: "PUBLISHED" },
      data: { viewCount: { increment: 1 } },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
