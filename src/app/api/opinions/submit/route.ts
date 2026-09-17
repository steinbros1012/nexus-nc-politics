import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { rateLimit } from "@/lib/rateLimit";

const opinionSchema = z.object({
  type: z.enum(["EDITORIAL", "LETTER"]),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(2).default("NC"),
  organization: z.string().max(200).optional().nullable(),
  titleRole: z.string().max(200).optional().nullable(),
  headline: z.string().min(5).max(300),
  body: z.string().min(50).max(15000),
  authorBio: z.string().max(2000).optional().nullable(),
  supportingLinks: z.array(z.string().url()).max(10).default([]),
  confirmOriginal: z.literal(true),
  confirmAccuracy: z.literal(true),
  confirmEditing: z.literal(true),
});

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "opinions", 3, 60 * 60 * 1000); // 3 per hour
  if (limited) return limited;

  try {
    const body = await req.json();
    const data = opinionSchema.parse(body);

    const opinion = await prisma.opinionSubmission.create({
      data: {
        type: data.type,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        city: data.city || null,
        state: data.state,
        organization: data.organization || null,
        titleRole: data.titleRole || null,
        headline: data.headline,
        body: data.body,
        authorBio: data.authorBio || null,
        supportingLinks: data.supportingLinks,
        confirmOriginal: data.confirmOriginal,
        confirmAccuracy: data.confirmAccuracy,
        confirmEditing: data.confirmEditing,
        slug: slugify(data.headline) + "-" + Date.now().toString(36),
      },
    });

    return NextResponse.json(
      { success: true, id: opinion.id },
      { status: 201 }
    );
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
