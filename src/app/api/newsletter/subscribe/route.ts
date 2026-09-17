import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  email: z.string().email().max(255),
});

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "newsletter", 3, 60 * 60 * 1000); // 3 per hour
  if (limited) return limited;

  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    });

    return NextResponse.json({ success: true, message: "You are subscribed!" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
