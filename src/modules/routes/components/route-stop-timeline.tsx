"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { getPlaceById } from "@/domain/data/places";
import { useTranslation } from "@/hooks/use-translation";
import { routeTransportLabel } from "../utils/route-labels";
import type { RouteStop } from "../types";

type Props = {
  stops: RouteStop[];
  showChecklist?: boolean;
};

export function RouteStopTimeline({ stops, showChecklist }: Props) {
  const { t, loc, locale } = useTranslation();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const ordered = [...stops].sort((a, b) => a.order - b.order);

  return (
    <ol className="space-y-4 border-l-2 border-heritage/30 pl-4">
      {ordered.map((stop) => {
        const place = getPlaceById(stop.placeId);
        return (
          <li key={stop.order} className="relative">
            <span className="absolute -left-[21px] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-heritage text-[8px] text-white">
              {stop.order}
            </span>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{place ? loc(place.name) : stop.placeId}</p>
                <p className="text-xs text-charcoal/50">
                  {stop.durationMin} {t("routes.stop.min")} · {routeTransportLabel(locale, stop.transportMode)}
                  {stop.recommendedTime && ` · ${loc(stop.recommendedTime)}`}
                </p>
                {stop.note && <p className="mt-1 text-xs text-charcoal/60">{loc(stop.note)}</p>}
              </div>
              {showChecklist && (
                <button
                  type="button"
                  onClick={() => setChecked((c) => ({ ...c, [stop.order]: !c[stop.order] }))}
                  aria-label={t("routes.stop.toggleChecklist")}
                >
                  <CheckCircle2
                    className={`h-5 w-5 ${checked[stop.order] ? "text-heritage" : "text-charcoal/20"}`}
                  />
                </button>
              )}
            </div>
            {place && (
              <div className="mt-1 flex gap-3 text-xs">
                <Link href={`/map?place=${place.id}`} className="text-heritage hover:underline">
                  {t("routes.action.place")}
                </Link>
                {place.qrCode && (
                  <Link href={`/qr/${place.id}`} className="text-heritage hover:underline">
                    {t("routes.action.qr")}
                  </Link>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
