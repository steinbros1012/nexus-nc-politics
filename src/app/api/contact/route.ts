import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

async function sendEmail(name: string, email: string, subject: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  if (!apiKey || !notificationEmail) return;

  const publicationName = process.env.NEXT_PUBLIC_PUBLICATION_NAME || "NC Politics Now";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${publicationName} <onboarding@resend.dev>`,
      to: [notificationEmail],
      reply_to: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${message}</p>
        <hr />
        <p style="color:#888;font-size:12px">Submitted via ${publicationName} contact form. Reply directly to this email to respond to ${name}.</p>
      `,
    }),
  });
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "contact", 5, 15 * 60 * 1000); // 5 per 15 min
  if (limited) return limited;

  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });

    // Send email notification (silently fails if not configured)
    try {
      await sendEmail(data.name, data.email, data.subject, data.message);
    } catch {
      // Email failure doesn't block the submission
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
