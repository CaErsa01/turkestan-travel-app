"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { getMapProviderFromEnv } from "../providers/config";
import type { MapViewProps } from "../providers/types";
import { useMapModuleStore } from "../store/use-map-module-store";
import { AlertCircle, Map as MapIcon } from "lucide-react";

const LeafletMapInner = dynamic(
  () => import("./leaflet-map-inner").then((m) => m.LeafletMapInner),
  { ssr: false, loading: () => <MapLoading /> }
);

const GoogleMapInner = dynamic(
  () => import("./google-map-inner").then((m) => m.GoogleMapInner),
  { ssr: false, loading: () => <MapLoading /> }
);

const YandexMapInner = dynamic(
  () => import("./yandex-map-inner").then((m) => m.YandexMapInner),
  { ssr: false, loading: () => <MapLoading /> }
);

function MapLoading() {
  return (
    <div className="flex h-full min-h-[320px] items-center justify-center bg-charcoal/5">
      <div className="text-center">
        <MapIcon className="mx-auto h-8 w-8 animate-pulse text-heritage" />
        <p className="mt-2 text-sm text-charcoal/60">Loading map…</p>
      </div>
    </div>
  );
}

export function MapView(props: Omit<MapViewProps, "onMapReady" | "onMapError">) {
  const provider = useMemo(() => getMapProviderFromEnv(), []);
  const setProviderStatus = useMapModuleStore((s) => s.setProviderStatus);
  const providerStatus = useMapModuleStore((s) => s.providerStatus);
  const providerError = useMapModuleStore((s) => s.providerError);

  useEffect(() => {
    setProviderStatus("loading");
  }, [setProviderStatus]);

  const handlers: Pick<MapViewProps, "onMapReady" | "onMapError"> = {
    onMapReady: () => setProviderStatus("ready"),
    onMapError: (message) => setProviderStatus("error", message),
  };

  if (providerStatus === "error" && providerError) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-amber-600" />
        <p className="font-semibold text-charcoal">Map unavailable</p>
        <p className="text-sm text-charcoal/70">{providerError}</p>
        <p className="text-xs text-charcoal/50">
          Set NEXT_PUBLIC_MAP_PROVIDER=leaflet or add API keys in .env.local
        </p>
      </div>
    );
  }

  const fullProps = { ...props, ...handlers };

  if (provider === "google") {
    return <GoogleMapInner {...fullProps} />;
  }
  if (provider === "yandex") {
    return <YandexMapInner {...fullProps} />;
  }
  return <LeafletMapInner {...fullProps} />;
}

export function MapProviderBadge() {
  const id = getMapProviderFromEnv();
  const labels = { leaflet: "OpenStreetMap", google: "Google Maps", yandex: "Yandex Maps" };
  return (
    <span className="rounded-full bg-charcoal/80 px-2 py-0.5 text-[10px] font-medium text-white">
      {labels[id]}
    </span>
  );
}
