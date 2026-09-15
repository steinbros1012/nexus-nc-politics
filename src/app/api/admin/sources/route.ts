import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const sourceSchema = z.object({
  name: z.string().min(1).max(200),
  website: z.string().url(),
  rssUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(2000).optional(),
  active: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = sourceSchema.parse(body);

    const slug = slugify(data.name);
    const existing = await prisma.newsSource.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A source with this name already exists." },
        { status: 409 }
      );
    }

    const source = await prisma.newsSource.create({
      data: {
        name: data.name,
        slug,
        website: data.website,
        rssUrl: data.rssUrl || null,
        description: data.description || null,
        active: data.active,
      },
    });

    return NextResponse.json({ source }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
