"use client";

import { RouteCard } from "./route-card";
import { useTranslation } from "@/hooks/use-translation";
import type { Route } from "../types";

type Props = {
  routes: Route[];
  compareIds: string[];
  favoriteIds: string[];
  onCompareToggle: (id: string) => void;
  linkPrefix?: string;
  compact?: boolean;
};

export function RouteList({
  routes,
  compareIds,
  favoriteIds,
  onCompareToggle,
  linkPrefix = "/routes",
  compact,
}: Props) {
  const { t } = useTranslation();

  if (routes.length === 0) {
    return (
      <div className="panel-light py-12 text-center text-sm text-charcoal/60">
        {t("routes.empty")}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${compact ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"}`}>
      {routes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          href={`${linkPrefix}/${route.id}`}
          isFavorite={favoriteIds.includes(route.id)}
          isCompare={compareIds.includes(route.id)}
          onCompareToggle={() => onCompareToggle(route.id)}
          compact={compact}
        />
      ))}
    </div>
  );
}
