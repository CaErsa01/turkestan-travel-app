"use client";

import { ExternalLink } from "lucide-react";
import {
  BOOKING_CATEGORIES,
  getPartnersByCategory,
  type BookingCategory,
  type BookingPartner,
} from "@/lib/external-links";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
  className?: string;
};

const CATEGORY_KEYS: Record<BookingCategory, string> = {
  hotels: "booking.category.hotels",
  apartments: "booking.category.apartments",
  flights: "booking.category.flights",
  tours: "booking.category.tours",
};

const REGION_KEYS: Record<BookingPartner["region"], string> = {
  kz: "booking.region.kz",
  global: "booking.region.global",
  cis: "booking.region.cis",
};

export function BookingPartnersPanel({ compact, className }: Props) {
  const { t, loc } = useTranslation();

  return (
    <div className={cn("space-y-5", className)}>
      <p className="text-sm text-charcoal/70">{t("booking.subtitle")}</p>

      {BOOKING_CATEGORIES.map((category) => {
        const partners = getPartnersByCategory(category);
        if (partners.length === 0) return null;

        return (
          <section key={category}>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/50">
              {t(CATEGORY_KEYS[category])}
            </h3>
            {category === "apartments" && (
              <p className="mb-2 text-xs text-heritage/80">{t("booking.apartmentsTip")}</p>
            )}
            {category === "flights" && (
              <p className="mb-2 text-xs text-charcoal/55">{t("booking.flightsTip")}</p>
            )}
            <ul
              className={cn(
                "grid gap-2",
                compact ? "grid-cols-1" : "sm:grid-cols-2"
              )}
            >
              {partners.map((p) => (
                <li key={p.id}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-charcoal/10 bg-white p-3 shadow-sm transition hover:border-heritage hover:shadow-md"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{ backgroundColor: p.color }}
                      aria-hidden
                    >
                      {p.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="font-semibold text-charcoal group-hover:text-heritage">
                          {p.name}
                        </p>
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                            p.region === "kz"
                              ? "bg-gold/20 text-charcoal"
                              : p.region === "cis"
                                ? "bg-turquoise/15 text-heritage"
                                : "bg-charcoal/5 text-charcoal/50"
                          )}
                        >
                          {t(REGION_KEYS[p.region])}
                        </span>
                      </div>
                      <p className="truncate text-xs text-charcoal/60">{loc(p.description)}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-heritage opacity-60 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="text-[10px] text-charcoal/45">{t("booking.disclaimer")}</p>
    </div>
  );
}
