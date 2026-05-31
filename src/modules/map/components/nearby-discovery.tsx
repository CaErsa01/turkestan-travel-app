"use client";

import { useMemo } from "react";
import { useMapPlaces } from "../hooks/use-map-places";
import { useMapModuleStore } from "../store/use-map-module-store";
import { useTranslation } from "@/hooks/use-translation";
import { formatDistance } from "../utils/geo";
import type { PlaceCategory } from "@/domain/types";

const NEARBY_TABS: { id: PlaceCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sacred", label: "Attractions" },
  { id: "hotel", label: "Hotels" },
  { id: "restaurant", label: "Food" },
  { id: "transport", label: "Transport" },
];

export function NearbyDiscovery() {
  const { summaries } = useMapPlaces();
  const { loc, locale } = useTranslation();
  const nearbyCategory = useMapModuleStore((s) => s.filter.nearbyCategory);
  const setFilter = useMapModuleStore((s) => s.setFilter);
  const setSelectedPlace = useMapModuleStore((s) => s.setSelectedPlace);
  const userLocation = useMapModuleStore((s) => s.userLocation);

  const nearby = useMemo(() => {
    let list = [...summaries];
    if (nearbyCategory !== "all") {
      list = list.filter((p) => p.category === nearbyCategory);
    }
    if (userLocation) {
      list.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    }
    return list.slice(0, 6);
  }, [summaries, nearbyCategory, userLocation]);

  return (
    <section className="rounded-xl border border-charcoal/10 bg-white p-3 shadow-sm">
      <h3 className="font-semibold text-sm">Nearby discovery</h3>
      <div className="mt-2 flex flex-wrap gap-1">
        {NEARBY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter({ nearbyCategory: tab.id })}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              nearbyCategory === tab.id ? "bg-heritage text-white" : "bg-charcoal/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ul className="mt-2 space-y-1">
        {nearby.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between text-left text-xs hover:text-heritage"
              onClick={() => setSelectedPlace(p.id)}
            >
              <span className="truncate">{loc(p.name)}</span>
              <span className="shrink-0 text-charcoal/40">
                {formatDistance(p.distanceKm, locale)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
