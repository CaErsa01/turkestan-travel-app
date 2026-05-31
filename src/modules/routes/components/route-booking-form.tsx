"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/shared/loading-state";
import { useTranslation } from "@/hooks/use-translation";
import { submitRouteBooking } from "../lib/api";
import { calculateRoutePrice } from "../utils/pricing";
import { RoutePriceBox } from "./route-price-box";
import type { Route, RouteBookingInput, RouteBookingRecord } from "../types";

type FormValues = {
  date: string;
  travelers: number;
  language: "kk" | "ru" | "en";
  transportMode: "walking" | "driving" | "mixed";
  includeGuide: boolean;
  includeHotel: boolean;
  includeMeals: boolean;
  includeExcursion: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

type Props = {
  route: Route;
  onSuccess: (record: RouteBookingRecord) => void;
};

export function RouteBookingForm({ route, onSuccess }: Props) {
  const { t, locale } = useTranslation();
  const [step, setStep] = useState<"form" | "confirm" | "submitting" | "done">("form");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<FormValues | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        date: z.string().min(1, t("routes.validation.date")),
        travelers: z.number().min(1).max(20),
        language: z.enum(["kk", "ru", "en"]),
        transportMode: z.enum(["walking", "driving", "mixed"]),
        includeGuide: z.boolean(),
        includeHotel: z.boolean(),
        includeMeals: z.boolean(),
        includeExcursion: z.boolean(),
        contactName: z.string().min(2, t("routes.validation.name")),
        contactEmail: z.string().email(t("routes.validation.email")),
        contactPhone: z.string().min(8, t("routes.validation.phone")),
      }),
    [t]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: route.availability[0]?.date ?? "",
      travelers: 2,
      language: locale,
      transportMode: route.transportType,
      includeGuide: route.bookingType !== "self-guided",
      includeHotel: false,
      includeMeals: false,
      includeExcursion: false,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const values = form.watch();
  const pricing = calculateRoutePrice(route, values, {
    isFamily: values.travelers >= 4,
    isEarlyBooking: true,
  });

  const onReview = form.handleSubmit((data) => {
    setPending(data);
    setStep("confirm");
  });

  const onSubmit = async () => {
    if (!pending) return;
    setStep("submitting");
    setError(null);
    try {
      const input: RouteBookingInput = { routeId: route.id, ...pending };
      const result = await submitRouteBooking({
        routeId: route.id,
        totalPriceKzt: pricing.total,
        breakdown: pricing.lines,
        contactName: pending.contactName,
        contactEmail: pending.contactEmail,
        contactPhone: pending.contactPhone,
        date: pending.date,
        travelers: pending.travelers,
      });
      onSuccess({
        ...input,
        id: result.id,
        totalPriceKzt: result.totalPriceKzt,
        breakdown: result.breakdown,
        status: result.status,
        createdAt: result.createdAt,
      });
      setStep("done");
    } catch {
      setError(t("routes.book.failed"));
      setStep("confirm");
    }
  };

  if (step === "submitting") return <LoadingState label={t("routes.book.submitting")} />;

  if (step === "done") {
    return (
      <div className="panel-light p-6 text-center">
        <p className="text-lg font-semibold text-heritage">{t("routes.book.success")}</p>
        <p className="mt-2 text-sm text-charcoal/70">
          {t("routes.book.successNote", { total: pricing.total.toLocaleString() })}
        </p>
      </div>
    );
  }

  if (step === "confirm" && pending) {
    return (
      <div className="space-y-4">
        <div className="panel-light p-4 text-sm">
          <h3 className="font-semibold">{t("routes.book.confirmTitle")}</h3>
          <p className="mt-2">
            {pending.date} · {t("routes.book.travelersCount", { count: pending.travelers })}
          </p>
          <p>{pending.contactName} · {pending.contactEmail}</p>
        </div>
        <RoutePriceBox
          route={route}
          input={pending}
          options={{ isFamily: pending.travelers >= 4, isEarlyBooking: true }}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setStep("form")}>{t("routes.book.back")}</Button>
          <Button onClick={onSubmit}>{t("routes.book.confirm")}</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onReview} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs">
          {t("routes.book.date")}
          <select {...form.register("date")} className="mt-1 w-full rounded border px-2 py-2 text-sm">
            {route.availability.map((a) => (
              <option key={a.date} value={a.date}>
                {a.date} ({t("routes.book.slots", { slots: a.slots })})
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          {t("routes.book.travelers")}
          <Input
            type="number"
            min={1}
            max={20}
            {...form.register("travelers", { valueAsNumber: true })}
            className="mt-1"
          />
        </label>
        <label className="text-xs">
          {t("routes.book.language")}
          <select {...form.register("language")} className="mt-1 w-full rounded border px-2 py-2 text-sm">
            <option value="kk">Қазақша</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="text-xs">
          {t("routes.book.transport")}
          <select {...form.register("transportMode")} className="mt-1 w-full rounded border px-2 py-2 text-sm">
            <option value="walking">{t("routes.transport.walking")}</option>
            <option value="driving">{t("routes.transport.driving")}</option>
            <option value="mixed">{t("routes.transport.mixed")}</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <label className="flex items-center gap-1">
          <input type="checkbox" {...form.register("includeGuide")} />
          {t("routes.book.guide")}
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" {...form.register("includeHotel")} />
          {t("routes.book.hotel")}
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" {...form.register("includeMeals")} />
          {t("routes.book.meals")}
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" {...form.register("includeExcursion")} />
          {t("routes.book.excursion")}
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Input placeholder={t("routes.book.name")} {...form.register("contactName")} />
        <Input placeholder={t("routes.book.email")} type="email" {...form.register("contactEmail")} />
        <Input placeholder={t("routes.book.phone")} {...form.register("contactPhone")} />
      </div>

      {Object.values(form.formState.errors).map((e, i) =>
        e?.message ? <p key={i} className="text-xs text-red-600">{String(e.message)}</p> : null
      )}

      <RoutePriceBox route={route} input={values} options={{ isFamily: values.travelers >= 4, isEarlyBooking: true }} />
      <Button type="submit" className="w-full">{t("routes.book.review")}</Button>
    </form>
  );
}
