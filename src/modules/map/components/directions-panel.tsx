"use client";

import { Navigation, Clock, Footprints } from "lucide-react";
import { useMapModuleStore } from "../store/use-map-module-store";

export function DirectionsPanel() {
  const plannedRoute = useMapModuleStore((s) => s.plannedRoute);
  const showDirections = useMapModuleStore((s) => s.showDirections);
  const setShowDirections = useMapModuleStore((s) => s.setShowDirections);

  if (!showDirections || !plannedRoute || plannedRoute.steps.length === 0) {
    if (!plannedRoute) return null;
    return (
      <aside className="rounded-xl border border-charcoal/10 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Route summary</h3>
          <button type="button" className="text-xs text-charcoal/50" onClick={() => setShowDirections(false)}>
            Hide
          </button>
        </div>
        <p className="mt-2 flex gap-3 text-sm text-charcoal/70">
          <span className="flex items-center gap-1">
            <Footprints className="h-4 w-4" /> {plannedRoute.distanceKm} km
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {plannedRoute.durationMin} min
          </span>
          <span className="text-xs text-charcoal/40">({plannedRoute.source})</span>
        </p>
      </aside>
    );
  }

  return (
    <aside
      className="max-h-64 overflow-y-auto rounded-xl border border-charcoal/10 bg-white p-3 shadow-sm"
      aria-label="Turn-by-turn directions"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-1 font-semibold text-sm">
          <Navigation className="h-4 w-4 text-heritage" />
          Directions
        </h3>
        <span className="text-xs text-charcoal/50">
          {plannedRoute.distanceKm} km · {plannedRoute.durationMin} min
        </span>
      </div>
      <ol className="space-y-2">
        {plannedRoute.steps.map((step, i) => (
          <li key={i} className="border-b border-charcoal/5 pb-2 text-xs last:border-0">
            <p className="text-charcoal/90">{step.instruction}</p>
            <p className="mt-0.5 text-charcoal/45">
              {step.distance} · {step.duration}
            </p>
          </li>
        ))}
      </ol>
    </aside>
  );
}
