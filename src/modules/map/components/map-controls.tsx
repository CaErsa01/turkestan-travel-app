"use client";

import { Maximize2, Minimize2, Route, SlidersHorizontal } from "lucide-react";
import { useMapModuleStore } from "../store/use-map-module-store";

export function MapControls() {
  const isFullscreen = useMapModuleStore((s) => s.isFullscreen);
  const setFullscreen = useMapModuleStore((s) => s.setFullscreen);
  const showRouteBuilder = useMapModuleStore((s) => s.showRouteBuilder);
  const setShowRouteBuilder = useMapModuleStore((s) => s.setShowRouteBuilder);
  const showFilters = useMapModuleStore((s) => s.showFilters);
  const setShowFilters = useMapModuleStore((s) => s.setShowFilters);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-charcoal/10 hover:bg-charcoal/5"
        aria-label="Toggle filters"
        aria-pressed={showFilters}
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => setShowRouteBuilder(!showRouteBuilder)}
        className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-md ring-1 ring-charcoal/10 ${
          showRouteBuilder ? "bg-heritage text-white" : "bg-white hover:bg-charcoal/5"
        }`}
        aria-label="Route builder"
        aria-pressed={showRouteBuilder}
      >
        <Route className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => setFullscreen(!isFullscreen)}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-charcoal/10 hover:bg-charcoal/5"
        aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </button>
    </div>
  );
}
