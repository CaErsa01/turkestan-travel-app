import { Resend } from "resend";
import nodemailer from "nodemailer";
import { ADMIN_EMAIL } from "@/lib/contact/config";

export type AdminEmailPayload = {
  subject: string;
  body: string;
  replyTo?: string;
};

async function sendViaResend(payload: AdminEmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const resend = new Resend(apiKey);
  const from =
    process.env.RESEND_FROM ?? "Turkestan Travel <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: ADMIN_EMAIL,
    subject: payload.subject,
    text: payload.body,
    replyTo: payload.replyTo,
  });

  if (error) {
    console.error("[email] Resend error:", error);
    return false;
  }
  return true;
}

async function sendViaSmtp(payload: AdminEmailPayload): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return false;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? `Turkestan Travel <${user}>`,
      to: ADMIN_EMAIL,
      subject: payload.subject,
      text: payload.body,
      replyTo: payload.replyTo,
    });
    return true;
  } catch (err) {
    console.error("[email] SMTP error:", err);
    return false;
  }
}

async function sendViaFormSubmit(payload: AdminEmailPayload): Promise<boolean> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(ADMIN_EMAIL)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: payload.subject,
        _template: "table",
        message: payload.body,
        _replyto: payload.replyTo ?? "noreply@turkestan-travel.kz",
      }),
    });

    if (!res.ok) {
      console.error("[email] FormSubmit HTTP", res.status);
      return false;
    }

    const data = (await res.json()) as { success?: string };
    return data.success === "true";
  } catch (err) {
    console.error("[email] FormSubmit error:", err);
    return false;
  }
}

/** Resend → SMTP → FormSubmit fallback chain */
export async function sendAdminNotification(payload: AdminEmailPayload): Promise<boolean> {
  if (await sendViaResend(payload)) return true;
  if (await sendViaSmtp(payload)) return true;
  return sendViaFormSubmit(payload);
}
