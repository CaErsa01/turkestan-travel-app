"use client";

import Link from "next/link";
import { Clock, Footprints, MapPin, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/shared/safe-image";
import { useTranslation } from "@/hooks/use-translation";
import { routeDifficultyLabel, routeTagLabel } from "../utils/route-labels";
import { estimateDisplayPrice } from "../utils/pricing";
import type { Route } from "../types";

type Props = {
  route: Route;
  href: string;
  isFavorite?: boolean;
  isCompare?: boolean;
  onCompareToggle?: () => void;
  compact?: boolean;
};

export function RouteCard({
  route,
  href,
  isFavorite,
  isCompare,
  onCompareToggle,
  compact,
}: Props) {
  const { t, loc, locale } = useTranslation();
  const price = estimateDisplayPrice(route);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm transition hover:border-heritage/40 hover:shadow-md">
      <Link href={href} className="absolute inset-0 z-10" aria-label={loc(route.title)} />
      {!compact && (
        <div className="relative h-36 w-full overflow-hidden">
          <SafeImage
            src={route.coverImage}
            alt={loc(route.title)}
            fill
            className="object-cover transition group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-3 flex gap-1">
            {route.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="sand" className="bg-white/90 text-[10px]">
                {routeTagLabel(locale, tag)}
              </Badge>
            ))}
          </div>
          {isFavorite && (
            <span className="absolute right-2 top-2 rounded-full bg-heritage px-2 py-0.5 text-[10px] text-white">
              ★
            </span>
          )}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-charcoal group-hover:text-heritage">{loc(route.title)}</h3>
            <p className="mt-0.5 text-xs text-charcoal/60">{loc(route.subtitle)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 text-xs text-heritage">
            <Star className="h-3.5 w-3.5 fill-current" />
            {route.rating}
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-xs text-charcoal/70">{loc(route.shortSummary)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-charcoal/55">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {t("routes.card.hours", { hours: route.durationHours })}
          </span>
          <span className="flex items-center gap-1">
            <Footprints className="h-3 w-3" /> {route.totalDistanceKm} {t("common.km") ?? "km"}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {route.stops.length} {t("routes.card.stops")}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {route.bookingsCount}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-heritage">
            {price.toLocaleString()} ₸
            <span className="text-[10px] font-normal text-charcoal/50"> / {t("routes.card.perPerson")}</span>
          </span>
          <span className="rounded-full bg-charcoal/5 px-2 py-0.5 text-[10px]">
            {routeDifficultyLabel(locale, route.difficulty)}
          </span>
        </div>
      </div>
      {onCompareToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCompareToggle();
          }}
          className={`relative z-20 mx-4 mb-3 w-[calc(100%-2rem)] rounded-lg border py-1.5 text-xs ${
            isCompare ? "border-heritage bg-heritage/10 text-heritage" : "border-charcoal/15"
          }`}
        >
          {isCompare ? t("routes.compare.inCompare") : t("routes.action.compare")}
        </button>
      )}
    </article>
  );
}
