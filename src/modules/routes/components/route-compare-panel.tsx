"use client";

import { X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import {
  routeDifficultyLabel,
  routeTransportLabel,
} from "../utils/route-labels";
import { estimateDisplayPrice } from "../utils/pricing";
import type { Route } from "../types";

type Props = {
  routes: Route[];
  onRemove: (id: string) => void;
  onClose: () => void;
};

export function RouteComparePanel({ routes, onRemove, onClose }: Props) {
  const { t, loc, locale } = useTranslation();
  if (routes.length === 0) return null;

  const rows: { labelKey: string; values: (string | number)[] }[] = [
    {
      labelKey: "routes.compare.price",
      values: routes.map((r) => `${estimateDisplayPrice(r).toLocaleString()} ₸`),
    },
    {
      labelKey: "routes.compare.duration",
      values: routes.map((r) => t("routes.card.hours", { hours: r.durationHours })),
    },
    {
      labelKey: "routes.compare.distance",
      values: routes.map((r) => `${r.totalDistanceKm} ${t("common.km")}`),
    },
    { labelKey: "routes.compare.stops", values: routes.map((r) => r.stops.length) },
    {
      labelKey: "routes.compare.transport",
      values: routes.map((r) => routeTransportLabel(locale, r.transportType)),
    },
    {
      labelKey: "routes.compare.difficulty",
      values: routes.map((r) => routeDifficultyLabel(locale, r.difficulty)),
    },
    { labelKey: "routes.compare.rating", values: routes.map((r) => r.rating) },
    {
      labelKey: "routes.compare.included",
      values: routes.map((r) => r.included.map((i) => loc(i)).join(", ") || "—"),
    },
  ];

  return (
    <div className="panel-light overflow-x-auto p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{t("routes.compareTitle", { count: routes.length })}</h3>
        <button type="button" onClick={onClose} aria-label={t("common.cancel")}>
          <X className="h-5 w-5" />
        </button>
      </div>
      <table className="w-full min-w-[480px] text-xs">
        <thead>
          <tr className="border-b border-charcoal/10">
            <th className="py-2 text-left font-medium text-charcoal/50">—</th>
            {routes.map((r) => (
              <th key={r.id} className="px-2 py-2 text-left font-semibold">
                <div className="flex items-start justify-between gap-1">
                  <span>{loc(r.title)}</span>
                  <button type="button" onClick={() => onRemove(r.id)} className="text-charcoal/40 hover:text-red-500">
                    ×
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.labelKey} className="border-b border-charcoal/5">
              <td className="py-2 text-charcoal/60">{t(row.labelKey)}</td>
              {row.values.map((v, i) => (
                <td key={i} className="px-2 py-2">{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
