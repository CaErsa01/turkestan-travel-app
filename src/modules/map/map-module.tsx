"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { GoogleMapProvider } from "./google/google-map-provider";
import { MapContainer } from "./components/map-container";
import { PlaceSearch } from "./components/place-search";
import { FilterPanel } from "./components/filter-panel";
import { RoutePlanner } from "./components/route-planner";
import { DirectionsPanel } from "./components/directions-panel";
import { MapControls } from "./components/map-controls";
import { UserLocationControl } from "./components/user-location-control";
import { PlaceDetailsDrawer } from "./components/place-details-drawer";
import { SavedPlacesManager } from "./components/saved-places-manager";
import { NearbyDiscovery } from "./components/nearby-discovery";
import { useMapPlaces } from "./hooks/use-map-places";
import { useMapModuleStore } from "./store/use-map-module-store";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";

type MapModuleProps = {
  variant?: "page" | "embedded";
  className?: string;
};

function MapModuleInner({ variant = "page", className }: MapModuleProps) {
  const { summaries, isLoading, isError, refetch } = useMapPlaces();
  const selectedPlaceId = useMapModuleStore((s) => s.selectedPlaceId);
  const setSelectedPlace = useMapModuleStore((s) => s.setSelectedPlace);
  const isFullscreen = useMapModuleStore((s) => s.isFullscreen);
  const showRouteBuilder = useMapModuleStore((s) => s.showRouteBuilder);
  const showFilters = useMapModuleStore((s) => s.showFilters);

  const selectedPlace = useMemo(
    () => summaries.find((p) => p.id === selectedPlaceId) ?? null,
    [summaries, selectedPlaceId]
  );

  const mapHeight = isFullscreen
    ? "fixed inset-0 z-50 h-[100dvh]"
    : variant === "embedded"
      ? "h-[min(70vh,520px)]"
      : "h-[min(65vh,600px)]";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isFullscreen && "fixed inset-0 z-50 bg-[#FAF8F5] p-3",
        className
      )}
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
        <PlaceSearch />
        <SavedPlacesManager />
        <span className="hidden text-xs text-charcoal/50 lg:inline lg:pt-2">
          Google Maps · {summaries.length} places in Turkestan area
        </span>
      </div>

      {showFilters && <FilterPanel />}

      <div className={cn("flex flex-col gap-3 xl:flex-row", isFullscreen && "flex-1 min-h-0")}>
        {showRouteBuilder && (
          <div className="order-2 xl:order-1 xl:w-80 shrink-0 space-y-3">
            <RoutePlanner />
            <DirectionsPanel />
            {!isFullscreen && <NearbyDiscovery />}
          </div>
        )}

        <div
          className={cn(
            "relative order-1 flex-1 overflow-hidden rounded-2xl border border-charcoal/10 bg-charcoal/5 shadow-panel xl:order-2",
            mapHeight
          )}
        >
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
              <LoadingState label="Loading places…" />
            </div>
          )}
          {isError && (
            <div className="absolute inset-0 z-10 p-4">
              <ErrorState message="Failed to load places" onRetry={() => refetch()} />
            </div>
          )}

          <MapContainer
            className="h-full w-full min-h-[280px]"
            onMarkerClick={setSelectedPlace}
          />

          <div className="pointer-events-none absolute inset-0 z-[500]">
            <div className="pointer-events-auto absolute right-3 top-3 flex flex-col items-end gap-2">
              <MapControls />
              <UserLocationControl />
            </div>
          </div>

          <PlaceDetailsDrawer place={selectedPlace} onClose={() => setSelectedPlace(null)} />
        </div>
      </div>

      {!showRouteBuilder && <NearbyDiscovery />}
    </div>
  );
}

export function MapModule(props: MapModuleProps) {
  return (
    <GoogleMapProvider>
      <MapModuleInner {...props} />
    </GoogleMapProvider>
  );
}

export { MapModule as InteractiveMapModule };
