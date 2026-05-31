"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "@/hooks/use-translation";
import { useUserStore } from "@/stores/use-user-store";
import { useAppStore } from "@/stores/use-app-store";
import type { FeedbackTicket } from "@/domain/types";
import {
  ADMIN_EMAIL,
  ADMIN_PHONE_DISPLAY,
  ADMIN_PHONE_HREF,
} from "@/lib/contact/config";
import { ChevronDown, Phone, Mail, Loader2 } from "lucide-react";

const feedbackSchema = z.object({
  type: z.enum(["contact", "bug", "suggestion", "complaint"]),
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  category: z.string().optional(),
});

const FAQ = [
  {
    q: { kk: "QR код қалай жұмыс істейді?", ru: "Как работает QR?", en: "How does QR work?" },
    a: {
      kk: "Нысандағы QR кодты сканерлеңіз — толық тарихи ақпарат ашылады.",
      ru: "Отсканируйте QR на объекте — откроется полная историческая информация.",
      en: "Scan QR at any site to open rich historical content.",
    },
  },
  {
    q: { kk: "Офлайн режим бар ма?", ru: "Есть ли офлайн режим?", en: "Is offline mode available?" },
    a: {
      kk: "Иә — сақталған маршруттар, аудио және QR деректері офлайн қолжетімді.",
      ru: "Да — сохранённые маршруты, аудио и QR-данные доступны офлайн.",
      en: "Yes — saved routes, audio, and QR data work offline.",
    },
  },
  {
    q: {
      kk: "Брондауды қалай растауға болады?",
      ru: "Как подтвердить бронирование?",
      en: "How to confirm booking?",
    },
    a: {
      kk: "Брондау профильдегі тарихта «confirmed» статусымен көрсетіледі.",
      ru: "Бронирование отображается в истории профиля со статусом confirmed.",
      en: "Bookings appear in profile history with confirmed status.",
    },
  },
];

export default function HelpPage() {
  const { t, locale } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);
  const addFeedback = useUserStore((s) => s.addFeedback);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { type: "contact" },
  });

  const faqLocale = locale as "kk" | "ru" | "en";

  const onSubmit = async (values: z.infer<typeof feedbackSchema>) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("submit failed");

      const ticket: FeedbackTicket = {
        id: `fb-${Date.now()}`,
        ...values,
        createdAt: new Date().toISOString(),
        status: "submitted",
      };
      addFeedback(ticket);
      setSubmitted(true);
      showToast(t("help.thankYou"));
      form.reset({ type: "contact" });
    } catch {
      showToast(t("help.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title={t("help.title")} backHref="/" />

      <section className="panel-light mb-8 p-4">
        <h2 className="font-semibold">{t("help.contactTitle")}</h2>
        <p className="mt-1 text-sm text-charcoal/60">{t("help.contactDesc")}</p>
        <ul className="mt-4 space-y-3">
          <li>
            <a
              href={ADMIN_PHONE_HREF}
              className="flex items-center gap-3 rounded-xl border border-heritage/20 bg-heritage/5 p-3 transition hover:bg-heritage/10"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-heritage/15 text-heritage">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-charcoal/50">{t("help.phone")}</p>
                <p className="font-semibold text-heritage">{ADMIN_PHONE_DISPLAY}</p>
              </div>
            </a>
          </li>
          <li>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="flex items-center gap-3 rounded-xl border border-heritage/20 bg-heritage/5 p-3 transition hover:bg-heritage/10"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-heritage/15 text-heritage">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-charcoal/50">{t("help.email")}</p>
                <p className="font-semibold text-heritage">{ADMIN_EMAIL}</p>
              </div>
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold">FAQ</h2>
        <ul className="mt-3 space-y-2">
          {FAQ.map((item, i) => (
            <li key={i} className="panel-light overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between p-4 text-left text-sm font-medium"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {item.q[faqLocale] ?? item.q.en}
                <ChevronDown
                  className={`h-4 w-4 transition ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && (
                <p className="border-t border-charcoal/10 px-4 pb-4 text-sm text-charcoal/70">
                  {item.a[faqLocale] ?? item.a.en}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel-light p-4">
        <h2 className="font-semibold">{t("help.feedbackTitle")}</h2>
        {submitted ? (
          <p className="mt-4 text-sm text-green-700">{t("help.thankYou")}</p>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-3">
            <select {...form.register("type")} className="w-full rounded border px-3 py-2 text-sm">
              <option value="contact">{t("help.type.contact")}</option>
              <option value="bug">{t("help.type.bug")}</option>
              <option value="suggestion">{t("help.type.suggestion")}</option>
              <option value="complaint">{t("help.type.complaint")}</option>
            </select>
            <input
              {...form.register("name")}
              placeholder={t("help.namePlaceholder")}
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <input
              {...form.register("email")}
              placeholder={t("help.emailPlaceholder")}
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <textarea
              {...form.register("message")}
              rows={4}
              placeholder={t("help.messagePlaceholder")}
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex w-full items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("help.send")}
            </button>
          </form>
        )}
        <p className="mt-4 text-xs text-charcoal/50">{t("help.emergency")}</p>
      </section>
    </div>
  );
}
