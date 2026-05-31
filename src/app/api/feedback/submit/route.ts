import { NextResponse } from "next/server";
import { z } from "zod";
import { sendAdminNotification } from "@/lib/email/send-admin-notification";

const feedbackSubmitSchema = z.object({
  type: z.enum(["contact", "bug", "suggestion", "complaint"]),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  message: z.string().min(10).max(3000),
  category: z.string().optional(),
});

const TYPE_LABELS: Record<string, string> = {
  contact: "Contact",
  bug: "Bug report",
  suggestion: "Suggestion",
  complaint: "Complaint",
};

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = feedbackSubmitSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid feedback data" },
        { status: 400 }
      );
    }

    const { type, name, email, message, category } = parsed.data;
    const typeLabel = TYPE_LABELS[type] ?? type;

    const body = [
      `New feedback on Turkestan Travel App`,
      ``,
      `Type: ${typeLabel}`,
      category ? `Category: ${category}` : null,
      `Name: ${name}`,
      `Email: ${email}`,
      ``,
      `Message:`,
      message,
      ``,
      `Submitted: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n");

    const sent = await sendAdminNotification({
      subject: `[${typeLabel}] from ${name}`,
      body,
      replyTo: email,
    });

    if (!sent) {
      return NextResponse.json(
        { ok: false, error: "Failed to send notification" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/feedback/submit]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
