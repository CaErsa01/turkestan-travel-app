"use client";

import { useMapModuleStore } from "../store/use-map-module-store";
import { LAYER_LABELS, DEFAULT_LAYERS } from "../constants";
import type { MapLayerId } from "../types";
import { useAppStore } from "@/stores/use-app-store";
import { cn } from "@/lib/utils";

const LAYERS = Object.keys(DEFAULT_LAYERS) as MapLayerId[];

export function CategoryToggle() {
  const locale = useAppStore((s) => s.locale);
  const layers = useMapModuleStore((s) => s.filter.layers);
  const toggleLayer = useMapModuleStore((s) => s.toggleLayer);
  const historicalOnly = useMapModuleStore((s) => s.filter.historicalOnly);
  const setFilter = useMapModuleStore((s) => s.setFilter);

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Map layers">
      {LAYERS.map((layer) => {
        const on = layers[layer];
        const label = LAYER_LABELS[layer][locale];
        return (
          <button
            key={layer}
            type="button"
            onClick={() => toggleLayer(layer)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              on ? "bg-heritage text-white" : "bg-white text-charcoal/60 ring-1 ring-charcoal/10"
            )}
            aria-pressed={on}
          >
            {label}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => setFilter({ historicalOnly: !historicalOnly })}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold",
          historicalOnly ? "bg-gold text-charcoal" : "bg-white ring-1 ring-charcoal/10"
        )}
      >
        UNESCO / historical
      </button>
    </div>
  );
}
