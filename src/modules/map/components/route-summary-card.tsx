"use client";

import { Clock, Footprints, Trash2 } from "lucide-react";
import { useMapModuleStore } from "../store/use-map-module-store";
import { getPlaceById } from "@/domain/data/places";
import { useTranslation } from "@/hooks/use-translation";

export function RouteSummaryCard() {
  const { loc } = useTranslation();
  const plannedRoute = useMapModuleStore((s) => s.plannedRoute);
  const routeStopIds = useMapModuleStore((s) => s.routeStopIds);
  const routeMode = useMapModuleStore((s) => s.routeMode);
  const setRouteMode = useMapModuleStore((s) => s.setRouteMode);
  const removeRouteStop = useMapModuleStore((s) => s.removeRouteStop);
  const reorderRouteStop = useMapModuleStore((s) => s.reorderRouteStop);
  const clearRoute = useMapModuleStore((s) => s.clearRoute);

  if (routeStopIds.length === 0) {
    return (
      <p className="text-sm text-charcoal/50">
        Add places from the map or details panel to build a route.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["walking", "driving"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setRouteMode(m)}
            className={`rounded-lg px-2 py-1 text-xs font-medium capitalize ${
              routeMode === m ? "bg-heritage text-white" : "bg-charcoal/5"
            }`}
          >
            {m}
          </button>
        ))}
        <button
          type="button"
          onClick={clearRoute}
          className="ml-auto flex items-center gap-1 text-xs text-red-600"
        >
          <Trash2 className="h-3 w-3" /> Clear
        </button>
      </div>

      {plannedRoute && (
        <div className="flex gap-4 rounded-lg bg-heritage/10 px-3 py-2 text-sm">
          <span className="flex items-center gap-1">
            <Footprints className="h-4 w-4" /> {plannedRoute.distanceKm} km
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> ~{plannedRoute.durationMin} min
          </span>
        </div>
      )}

      <ol className="space-y-1">
        {routeStopIds.map((id, index) => {
          const place = getPlaceById(id);
          return (
            <li
              key={id}
              className="flex items-center gap-2 rounded-lg border border-charcoal/10 bg-white px-2 py-1.5 text-sm"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-heritage text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate">
                {place ? loc(place.name) : id}
              </span>
              <div className="flex shrink-0 gap-0.5">
                {index > 0 && (
                  <button
                    type="button"
                    className="px-1 text-xs text-heritage"
                    onClick={() => reorderRouteStop(index, index - 1)}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                )}
                {index < routeStopIds.length - 1 && (
                  <button
                    type="button"
                    className="px-1 text-xs text-heritage"
                    onClick={() => reorderRouteStop(index, index + 1)}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                )}
                <button
                  type="button"
                  className="px-1 text-xs text-red-500"
                  onClick={() => removeRouteStop(id)}
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
