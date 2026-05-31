"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchTourRoutes } from "./lib/api";
import { filterAndSortRoutes } from "./utils/filters";
import { useRoutesModuleStore } from "./store/use-routes-module-store";
import { RouteFiltersBar } from "./components/route-filters";
import { RouteList } from "./components/route-list";
import { RouteComparePanel } from "./components/route-compare-panel";
import { RoutePlannerPanel } from "./components/route-planner-panel";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { useTranslation } from "@/hooks/use-translation";

type Props = {
  variant?: "page" | "embedded";
  showPlanner?: boolean;
  compact?: boolean;
};

export function RoutesModule({ variant = "page", showPlanner = true, compact }: Props) {
  const { t } = useTranslation();
  const filters = useRoutesModuleStore((s) => s.filters);
  const compareIds = useRoutesModuleStore((s) => s.compareIds);
  const favoriteIds = useRoutesModuleStore((s) => s.favoriteIds);
  const recentRouteIds = useRoutesModuleStore((s) => s.recentRouteIds);
  const setFilters = useRoutesModuleStore((s) => s.setFilters);
  const resetFilters = useRoutesModuleStore((s) => s.resetFilters);
  const toggleCompare = useRoutesModuleStore((s) => s.toggleCompare);
  const clearCompare = useRoutesModuleStore((s) => s.clearCompare);
  const [showCompare, setShowCompare] = useState(false);

  const { data: routes, isLoading, isError, refetch } = useQuery({
    queryKey: ["tour-routes"],
    queryFn: fetchTourRoutes,
  });

  const filtered = useMemo(
    () => (routes ? filterAndSortRoutes(routes, filters) : []),
    [routes, filters]
  );

  const compareRoutes = useMemo(
    () => filtered.filter((r) => compareIds.includes(r.id)),
    [filtered, compareIds]
  );

  const recentRoutes = useMemo(
    () =>
      recentRouteIds
        .map((id) => routes?.find((r) => r.id === id))
        .filter(Boolean) as typeof filtered,
    [recentRouteIds, routes]
  );

  if (isLoading) return <LoadingState label={t("common.loading")} />;
  if (isError) return <ErrorState message={t("routes.loadFailed")} onRetry={() => refetch()} />;

  return (
    <div className={variant === "embedded" ? "space-y-4" : "space-y-6"}>
      {variant === "page" && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-charcoal/60">
            {t("routes.count", { count: filtered.length })} · {t("routes.subtitle")}
          </p>
          {compareIds.length > 0 && (
            <button
              type="button"
              onClick={() => setShowCompare(true)}
              className="text-sm font-semibold text-heritage hover:underline"
            >
              {t("routes.compare")} ({compareIds.length})
            </button>
          )}
        </div>
      )}

      {!compact && <RouteFiltersBar filters={filters} onChange={setFilters} onReset={resetFilters} />}

      {showCompare && compareRoutes.length > 0 && (
        <RouteComparePanel
          routes={compareRoutes}
          onRemove={toggleCompare}
          onClose={() => {
            setShowCompare(false);
            clearCompare();
          }}
        />
      )}

      <RouteList
        routes={filtered}
        compareIds={compareIds}
        favoriteIds={favoriteIds}
        onCompareToggle={toggleCompare}
        compact={compact || variant === "embedded"}
      />

      {recentRoutes.length > 0 && variant === "page" && (
        <div>
          <h3 className="mb-3 font-semibold">{t("routes.recent")}</h3>
          <RouteList
            routes={recentRoutes}
            compareIds={compareIds}
            favoriteIds={favoriteIds}
            onCompareToggle={toggleCompare}
            compact
          />
        </div>
      )}

      {showPlanner && variant === "page" && <RoutePlannerPanel />}

      {variant === "embedded" && (
        <Link href="/routes" className="block text-center text-sm font-semibold text-heritage hover:underline">
          {t("routes.allRoutes")}
        </Link>
      )}
    </div>
  );
}
