import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const opinion = await prisma.opinionSubmission.findUnique({
    where: { id },
  });

  if (!opinion) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ opinion });
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
  await prisma.opinionSubmission.delete({ where: { id } });
  return NextResponse.json({ success: true });
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

  const data: Record<string, unknown> = {};

  if (body.status) data.status = body.status;
  if (body.adminNotes !== undefined) data.adminNotes = body.adminNotes;
  if (body.tags) data.tags = body.tags;

  // When publishing, set slug and publishedAt
  if (body.status === "PUBLISHED") {
    const existing = await prisma.opinionSubmission.findUnique({
      where: { id },
    });
    if (existing && !existing.slug) {
      data.slug = slugify(existing.headline) + "-" + Date.now().toString(36);
    }
    if (existing && !existing.publishedAt) {
      data.publishedAt = new Date();
    }
  }

  const opinion = await prisma.opinionSubmission.update({
    where: { id },
    data,
  });

  return NextResponse.json({ opinion });
}
