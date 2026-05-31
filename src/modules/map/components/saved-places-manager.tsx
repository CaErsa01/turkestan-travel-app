"use client";

import { Heart, History, Route } from "lucide-react";
import { useMapModuleStore } from "../store/use-map-module-store";
import { getPlaceById } from "@/domain/data/places";
import { useTranslation } from "@/hooks/use-translation";

export function SavedPlacesManager() {
  const { loc } = useTranslation();
  const savedPlaceIds = useMapModuleStore((s) => s.savedPlaceIds);
  const savedRoutes = useMapModuleStore((s) => s.savedRoutes);
  const recentPlaces = useMapModuleStore((s) => s.recentPlaces);
  const setSelectedPlace = useMapModuleStore((s) => s.setSelectedPlace);
  const setRouteStopIds = useMapModuleStore((s) => s.setRouteStopIds);
  const showSaved = useMapModuleStore((s) => s.showSaved);
  const setShowSaved = useMapModuleStore((s) => s.setShowSaved);

  if (!showSaved) {
    return (
      <button
        type="button"
        onClick={() => setShowSaved(true)}
        className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium shadow-sm ring-1 ring-charcoal/10"
      >
        <Heart className="h-3.5 w-3.5 text-heritage" />
        Saved ({savedPlaceIds.length})
      </button>
    );
  }

  return (
    <aside className="rounded-xl border border-charcoal/10 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Saved & recent</h3>
        <button type="button" className="text-xs text-charcoal/50" onClick={() => setShowSaved(false)}>
          Close
        </button>
      </div>

      <section className="mt-3">
        <h4 className="flex items-center gap-1 text-xs font-bold uppercase text-charcoal/50">
          <Heart className="h-3 w-3" /> Favorites
        </h4>
        <ul className="mt-1 space-y-1">
          {savedPlaceIds.length === 0 ? (
            <li className="text-xs text-charcoal/40">No saved places</li>
          ) : (
            savedPlaceIds.map((id) => {
              const p = getPlaceById(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    className="text-xs text-heritage hover:underline"
                    onClick={() => setSelectedPlace(id)}
                  >
                    {p ? loc(p.name) : id}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </section>

      <section className="mt-3">
        <h4 className="flex items-center gap-1 text-xs font-bold uppercase text-charcoal/50">
          <Route className="h-3 w-3" /> Saved routes
        </h4>
        <ul className="mt-1 space-y-1">
          {savedRoutes.length === 0 ? (
            <li className="text-xs text-charcoal/40">No saved routes</li>
          ) : (
            savedRoutes.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  className="text-left text-xs text-heritage hover:underline"
                  onClick={() => setRouteStopIds(r.stopIds)}
                >
                  {r.name} — {r.distanceKm} km
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-3">
        <h4 className="flex items-center gap-1 text-xs font-bold uppercase text-charcoal/50">
          <History className="h-3 w-3" /> Recent
        </h4>
        <ul className="mt-1 space-y-1">
          {recentPlaces.slice(0, 5).map((r) => {
            const p = getPlaceById(r.placeId);
            return (
              <li key={r.placeId}>
                <button
                  type="button"
                  className="text-xs text-charcoal/70 hover:text-heritage"
                  onClick={() => setSelectedPlace(r.placeId)}
                >
                  {p ? loc(p.name) : r.placeId}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
