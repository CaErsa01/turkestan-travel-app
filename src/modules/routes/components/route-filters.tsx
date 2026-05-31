"use client";

import { useTranslation } from "@/hooks/use-translation";
import { routePresetLabel, routeTransportLabel } from "../utils/route-labels";
import type { RouteFilters, RoutePreset, RouteSortBy } from "../types";
import { DEFAULT_ROUTE_FILTERS } from "../utils/filters";

type Props = {
  filters: RouteFilters;
  onChange: (partial: Partial<RouteFilters>) => void;
  onReset: () => void;
};

const PRESETS: (RoutePreset | "all")[] = [
  "all",
  "1-day",
  "2-day",
  "historical",
  "family",
  "religious",
  "night",
  "budget",
  "premium",
];

const SORTS: RouteSortBy[] = ["popular", "cheapest", "shortest", "rating", "booked"];

export function RouteFiltersBar({ filters, onChange, onReset }: Props) {
  const { t, locale } = useTranslation();

  return (
    <div className="panel-light space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{t("routes.filters")}</h2>
        <button type="button" onClick={onReset} className="text-xs text-heritage hover:underline">
          {t("routes.reset")}
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange({ preset: p })}
            className={`rounded-full px-3 py-1 text-xs ${
              filters.preset === p ? "bg-heritage text-white" : "bg-white text-charcoal/70"
            }`}
          >
            {routePresetLabel(locale, p)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {(
          [
            ["familyFriendly", "routes.filter.family"],
            ["religious", "routes.filter.religious"],
            ["historical", "routes.filter.historical"],
            ["budget", "routes.filter.budget"],
            ["premium", "routes.filter.premium"],
          ] as const
        ).map(([key, labelKey]) => (
          <label key={key} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={filters[key]}
              onChange={(e) => onChange({ [key]: e.target.checked })}
            />
            {t(labelKey)}
          </label>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs">
          {t("routes.filter.maxPrice")}
          <input
            type="number"
            min={0}
            step={1000}
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onChange({ maxPrice: e.target.value ? Number(e.target.value) : null })
            }
            className="mt-1 w-full rounded border px-2 py-1"
            placeholder={t("routes.filter.any")}
          />
        </label>
        <label className="text-xs">
          {t("routes.filter.minRating")}
          <select
            value={filters.minRating}
            onChange={(e) => onChange({ minRating: Number(e.target.value) })}
            className="mt-1 w-full rounded border px-2 py-1"
          >
            <option value={0}>{t("routes.filter.any")}</option>
            <option value={4}>4+</option>
            <option value={4.5}>4.5+</option>
          </select>
        </label>
        <label className="text-xs">
          {t("routes.detail.transport")}
          <select
            value={filters.transportMode}
            onChange={(e) =>
              onChange({ transportMode: e.target.value as RouteFilters["transportMode"] })
            }
            className="mt-1 w-full rounded border px-2 py-1"
          >
            <option value="all">{t("routes.transport.all")}</option>
            <option value="walking">{t("routes.transport.walking")}</option>
            <option value="driving">{t("routes.transport.driving")}</option>
            <option value="mixed">{t("routes.transport.mixed")}</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-1">
        {SORTS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange({ sortBy: s })}
            className={`rounded-full px-3 py-1 text-xs ${
              filters.sortBy === s ? "bg-turquoise text-white" : "bg-charcoal/5"
            }`}
          >
            {t(`routes.sort.${s}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

export { DEFAULT_ROUTE_FILTERS };
