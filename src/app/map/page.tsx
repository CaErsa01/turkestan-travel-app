"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MapModule } from "@/modules/map";
import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "@/hooks/use-translation";
import { useMapModuleStore } from "@/modules/map/store/use-map-module-store";
import { getTourRouteById, getRouteStopIds } from "@/modules/routes/data/tour-routes";

function MapPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const routeId = searchParams.get("route");
  const placeId = searchParams.get("place");
  const setRouteStopIds = useMapModuleStore((s) => s.setRouteStopIds);
  const setRouteMode = useMapModuleStore((s) => s.setRouteMode);
  const setSelectedPlace = useMapModuleStore((s) => s.setSelectedPlace);

  useEffect(() => {
    if (!routeId) return;
    const route = getTourRouteById(routeId);
    if (!route) return;
    setRouteStopIds(getRouteStopIds(route));
    setRouteMode(route.transportType === "walking" ? "walking" : "driving");
  }, [routeId, setRouteStopIds, setRouteMode]);

  useEffect(() => {
    if (placeId) setSelectedPlace(placeId);
  }, [placeId, setSelectedPlace]);

  return (
    <div>
      <PageHeader title={t("map.title")} backHref="/" />
      <MapModule variant="page" />
    </div>
  );
}

export default function MapPage() {
  const { t } = useTranslation();
  return (
    <Suspense
      fallback={
        <div>
          <PageHeader title={t("map.title")} backHref="/" />
          <div className="flex min-h-[50vh] items-center justify-center text-charcoal/50">
            {t("common.loading")}
          </div>
        </div>
      }
    >
      <MapPageContent />
    </Suspense>
  );
}
