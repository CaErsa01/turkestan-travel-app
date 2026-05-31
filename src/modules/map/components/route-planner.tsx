"use client";

import { Clock, Footprints, Trash2, Save, Sparkles } from "lucide-react";
import { useMapModuleStore } from "../store/use-map-module-store";
import { getPlaceById } from "@/domain/data/places";
import { useTranslation } from "@/hooks/use-translation";
import { useAppStore } from "@/stores/use-app-store";

export function RoutePlanner() {
  const { loc } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);
  const plannedRoute = useMapModuleStore((s) => s.plannedRoute);
  const routeStopIds = useMapModuleStore((s) => s.routeStopIds);
  const routeMode = useMapModuleStore((s) => s.routeMode);
  const setRouteMode = useMapModuleStore((s) => s.setRouteMode);
  const removeRouteStop = useMapModuleStore((s) => s.removeRouteStop);
  const reorderRouteStop = useMapModuleStore((s) => s.reorderRouteStop);
  const clearRoute = useMapModuleStore((s) => s.clearRoute);
  const saveCurrentRoute = useMapModuleStore((s) => s.saveCurrentRoute);
  const setShowDirections = useMapModuleStore((s) => s.setShowDirections);

  return (
    <aside
      className="w-full shrink-0 rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm lg:w-80"
      aria-label="Route planner"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-charcoal">Route planner</h3>
        {plannedRoute?.source === "google" && (
          <span className="flex items-center gap-1 text-[10px] text-heritage">
            <Sparkles className="h-3 w-3" /> Google optimized
          </span>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        {(["walking", "driving"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setRouteMode(m)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize ${
              routeMode === m ? "bg-heritage text-white" : "bg-charcoal/5"
            }`}
          >
            {m}
          </button>
        ))}
        <button
          type="button"
          onClick={clearRoute}
          className="rounded-lg px-2 text-red-600 hover:bg-red-50"
          aria-label="Clear route"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {plannedRoute && (
        <div className="mt-3 flex gap-4 rounded-lg bg-heritage/10 px-3 py-2 text-sm">
          <span className="flex items-center gap-1">
            <Footprints className="h-4 w-4" /> {plannedRoute.distanceKm} km
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> ~{plannedRoute.durationMin} min
          </span>
        </div>
      )}

      {routeStopIds.length === 0 ? (
        <p className="mt-4 text-sm text-charcoal/50">
          Tap markers or use &quot;Add to route&quot; to build your trip.
        </p>
      ) : (
        <ol className="mt-3 space-y-1">
          {routeStopIds.map((id, index) => {
            const place = getPlaceById(id);
            return (
              <li
                key={id}
                className="flex items-center gap-2 rounded-lg border border-charcoal/10 px-2 py-1.5 text-sm"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-heritage text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  {place ? loc(place.name) : id}
                </span>
                <div className="flex shrink-0 gap-0.5">
                  {index > 0 && (
                    <button type="button" className="px-1 text-xs" onClick={() => reorderRouteStop(index, index - 1)}>↑</button>
                  )}
                  {index < routeStopIds.length - 1 && (
                    <button type="button" className="px-1 text-xs" onClick={() => reorderRouteStop(index, index + 1)}>↓</button>
                  )}
                  <button type="button" className="px-1 text-xs text-red-500" onClick={() => removeRouteStop(id)}>×</button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="btn-primary flex-1 text-xs"
          disabled={routeStopIds.length === 0}
          onClick={() => {
            saveCurrentRoute();
            showToast("Route saved to profile");
          }}
        >
          <Save className="mr-1 inline h-3.5 w-3.5" />
          Save route
        </button>
        <button
          type="button"
          className="btn-secondary text-xs"
          disabled={!plannedRoute?.steps.length}
          onClick={() => setShowDirections(true)}
        >
          Steps
        </button>
      </div>
    </aside>
  );
}
