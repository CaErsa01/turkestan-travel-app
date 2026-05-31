"use client";

import { LocateFixed, Loader2 } from "lucide-react";
import { useMapGeolocation } from "../hooks/use-map-geolocation";
import { useMapModuleStore } from "../store/use-map-module-store";

export function CurrentLocationButton() {
  const { requestLocation, loading } = useMapGeolocation();
  const geoError = useMapModuleStore((s) => s.geoError);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={requestLocation}
        disabled={loading}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-charcoal/10 hover:bg-heritage hover:text-white disabled:opacity-60"
        aria-label="My location"
        title="My location"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <LocateFixed className="h-5 w-5" />
        )}
      </button>
      {geoError && (
        <span className="max-w-[140px] rounded bg-amber-50 px-2 py-1 text-[10px] text-amber-800">
          {geoError}
        </span>
      )}
    </div>
  );
}
