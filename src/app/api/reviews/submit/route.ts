import { NextResponse } from "next/server";
import { z } from "zod";
import { PLACES } from "@/domain/data/places";
import { sendAdminNotification } from "@/lib/email/send-admin-notification";

const reviewSubmitSchema = z.object({
  placeId: z.string().min(1),
  author: z.string().min(2).max(80),
  email: z.string().email().optional(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10).max(2000),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = reviewSubmitSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid review data" },
        { status: 400 }
      );
    }

    const { placeId, author, email, rating, text } = parsed.data;
    const place = PLACES.find((p) => p.id === placeId);
    const placeName = place?.name.en ?? placeId;

    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    const body = [
      `New review on Turkestan Travel App`,
      ``,
      `Place: ${placeName} (${placeId})`,
      `Author: ${author}`,
      email ? `Email: ${email}` : null,
      `Rating: ${rating}/5 ${stars}`,
      ``,
      `Review:`,
      text,
      ``,
      `Submitted: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n");

    const sent = await sendAdminNotification({
      subject: `[Review] ${placeName} — ${rating}★ from ${author}`,
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
    console.error("[api/reviews/submit]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
