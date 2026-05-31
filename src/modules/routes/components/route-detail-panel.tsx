"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import {
  routeBookingTypeLabel,
  routeDifficultyLabel,
  routeTagLabel,
  routeTransportLabel,
} from "../utils/route-labels";
import { RouteStopTimeline } from "./route-stop-timeline";
import { RouteMapPreview } from "./route-map-preview";
import { RouteActionsBar } from "./route-actions-bar";
import { RouteBookingForm } from "./route-booking-form";
import { RoutePriceBox } from "./route-price-box";
import { estimateDisplayPrice } from "../utils/pricing";
import { useRoutesModuleStore } from "../store/use-routes-module-store";
import { getTourRouteById } from "../data/tour-routes";
import type { Route } from "../types";
import { useState } from "react";

type Props = {
  route: Route;
  variant?: "page" | "drawer";
  onCompare?: () => void;
};

export function RouteDetailPanel({ route, variant = "page", onCompare }: Props) {
  const { t, loc, locale } = useTranslation();
  const addBooking = useRoutesModuleStore((s) => s.addBooking);
  const [showBooking, setShowBooking] = useState(false);
  const price = estimateDisplayPrice(route);

  return (
    <div className={variant === "drawer" ? "space-y-4" : "space-y-6"}>
      <div className="relative h-48 overflow-hidden rounded-2xl md:h-64">
        <SafeImage src={route.coverImage} alt={loc(route.title)} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex flex-wrap gap-1">
            {route.tags.map((tag) => (
              <Badge key={tag} variant="sand" className="bg-white/20 text-white">
                {routeTagLabel(locale, tag)}
              </Badge>
            ))}
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold">{loc(route.title)}</h1>
          <p className="text-sm text-white/80">{loc(route.subtitle)}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-gold text-gold" />
              {route.rating} ({route.reviewCount})
            </span>
            <span>
              {t("routes.card.hours", { hours: route.durationHours })} · {route.totalDistanceKm}{" "}
              {t("common.km")}
            </span>
            <span className="font-bold">{price.toLocaleString()} ₸+</span>
          </div>
        </div>
      </div>

      <RouteActionsBar route={route} onBook={() => setShowBooking(true)} onCompare={onCompare} />

      <p className="text-charcoal/80">{loc(route.description)}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel-light p-4 text-sm">
          <h3 className="font-semibold">{t("routes.detail.tripInfo")}</h3>
          <dl className="mt-2 space-y-1 text-xs text-charcoal/70">
            <div className="flex justify-between">
              <dt>{t("routes.detail.transport")}</dt>
              <dd>{routeTransportLabel(locale, route.transportType)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("routes.detail.season")}</dt>
              <dd>{loc(route.bestSeason)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("routes.detail.timeOfDay")}</dt>
              <dd>{loc(route.recommendedTimeOfDay)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("routes.detail.accessibility")}</dt>
              <dd>{loc(route.accessibilityNotes)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("routes.detail.bookingType")}</dt>
              <dd>{routeBookingTypeLabel(locale, route.bookingType)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t("routes.compare.difficulty")}</dt>
              <dd>{routeDifficultyLabel(locale, route.difficulty)}</dd>
            </div>
          </dl>
        </div>
        <div className="panel-light p-4 text-sm">
          <h3 className="font-semibold">{t("routes.detail.services")}</h3>
          <p className="mt-2 text-xs font-medium text-green-700">{t("routes.detail.included")}</p>
          <ul className="list-inside list-disc text-xs text-charcoal/70">
            {route.included.map((item, i) => (
              <li key={i}>{loc(item)}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs font-medium text-charcoal/50">{t("routes.detail.excluded")}</p>
          <ul className="list-inside list-disc text-xs text-charcoal/50">
            {route.excluded.map((item, i) => (
              <li key={i}>{loc(item)}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">{t("routes.detail.map")}</h3>
        <RouteMapPreview route={route} className="h-64 md:h-80" />
      </div>

      <div className="panel-light p-4">
        <h3 className="font-semibold">{t("routes.detail.itinerary")}</h3>
        <div className="mt-4">
          <RouteStopTimeline stops={route.stops} showChecklist />
        </div>
      </div>

      {!showBooking ? (
        <RoutePriceBox
          route={route}
          input={{
            travelers: 2,
            includeGuide: route.bookingType !== "self-guided",
            includeHotel: false,
            includeMeals: false,
            includeExcursion: false,
          }}
          options={{ isEarlyBooking: true, isFamily: true }}
        />
      ) : (
        <div className="panel-light p-4">
          <h3 className="mb-4 font-semibold">{t("routes.detail.bookRoute")}</h3>
          <RouteBookingForm
            route={route}
            onSuccess={(record) => {
              addBooking(record);
              setShowBooking(false);
            }}
          />
        </div>
      )}

      {route.reviews.length > 0 && (
        <div className="panel-light p-4">
          <h3 className="font-semibold">{t("routes.detail.reviews")}</h3>
          <ul className="mt-3 space-y-3">
            {route.reviews.map((r) => (
              <li key={r.id} className="border-b border-charcoal/5 pb-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{r.author}</span>
                  <span className="text-heritage">★ {r.rating}</span>
                </div>
                <p className="text-xs text-charcoal/70">{loc(r.text)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {route.relatedRouteIds.length > 0 && (
        <div>
          <h3 className="font-semibold">{t("routes.detail.related")}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {route.relatedRouteIds.map((id) => {
              const related = getTourRouteById(id);
              return (
                <Link key={id} href={`/routes/${id}`} className="text-sm text-heritage hover:underline">
                  {related ? loc(related.title) : id} →
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
