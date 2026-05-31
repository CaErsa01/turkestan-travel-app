"use client";

import { useMapModuleStore } from "../store/use-map-module-store";
import { CategoryToggle } from "./category-toggle";
import type { MapSortBy } from "../types";

export function FilterPanel() {
  const filter = useMapModuleStore((s) => s.filter);
  const setFilter = useMapModuleStore((s) => s.setFilter);

  return (
    <div className="space-y-3 rounded-xl border border-charcoal/10 bg-white p-3 shadow-sm">
      <CategoryToggle />
      <div className="flex flex-wrap gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filter.openNowOnly}
            onChange={(e) => setFilter({ openNowOnly: e.target.checked })}
          />
          Open now
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filter.nearMeOnly}
            onChange={(e) => setFilter({ nearMeOnly: e.target.checked })}
          />
          Near me
        </label>
        <select
          value={filter.minRating}
          onChange={(e) => setFilter({ minRating: Number(e.target.value) })}
          className="rounded-lg border border-charcoal/10 px-2 py-1 text-xs"
        >
          <option value={0}>Any rating</option>
          <option value={4}>4+</option>
          <option value={4.5}>4.5+</option>
        </select>
        <select
          value={filter.sortBy}
          onChange={(e) => setFilter({ sortBy: e.target.value as MapSortBy })}
          className="rounded-lg border border-charcoal/10 px-2 py-1 text-xs"
        >
          <option value="popularity">Popular</option>
          <option value="nearest">Nearest</option>
          <option value="rating">Top rated</option>
          <option value="open">Open now</option>
        </select>
        {filter.nearMeOnly && (
          <select
            value={filter.maxDistanceKm}
            onChange={(e) => setFilter({ maxDistanceKm: Number(e.target.value) })}
            className="rounded-lg border border-charcoal/10 px-2 py-1 text-xs"
          >
            <option value={5}>5 km</option>
            <option value={15}>15 km</option>
            <option value={30}>30 km</option>
          </select>
        )}
      </div>
    </div>
  );
}
