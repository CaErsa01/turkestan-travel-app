"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { GoogleMapProvider, useGoogleMap } from "@/modules/map/google/google-map-provider";
import { TURKESTAN_CENTER, TURKESTAN_BOUNDS } from "@/modules/map/constants";
import { getPlaceById } from "@/domain/data/places";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { useTranslation } from "@/hooks/use-translation";
import { useRoutePath } from "../hooks/use-route-path";
import { getRouteStopIds } from "../data/tour-routes";
import type { Route, RouteTransportMode } from "../types";

const MAP_STYLE = { width: "100%", height: "100%" };

const BOUNDS = {
  north: TURKESTAN_BOUNDS.north,
  south: TURKESTAN_BOUNDS.south,
  east: TURKESTAN_BOUNDS.east,
  west: TURKESTAN_BOUNDS.west,
};

const MAP_OPTIONS: google.maps.MapOptions = {
  restriction: { latLngBounds: BOUNDS, strictBounds: false },
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};

const POLYLINE_OPTIONS: google.maps.PolylineOptions = {
  strokeColor: "#0D7377",
  strokeWeight: 4,
  strokeOpacity: 0.9,
};

type InnerProps = {
  stopIds: string[];
  mode: RouteTransportMode;
  className?: string;
};

function RouteMapInner({ stopIds, mode, className }: InnerProps) {
  const { t } = useTranslation();
  const { isLoaded, isConfigured, loadError, setMap, map } = useGoogleMap();
  const { path, loading, error } = useRoutePath(stopIds, mode);
  const fittedKey = useRef<string | null>(null);

  const polylinePath = useMemo(
    () => path?.polyline.map((p) => ({ lat: p.lat, lng: p.lng })) ?? [],
    [path]
  );

  const polylineKey = useMemo(
    () => polylinePath.map((p) => `${p.lat},${p.lng}`).join("|"),
    [polylinePath]
  );

  const markers = useMemo(
    () =>
      stopIds
        .map((id, i) => {
          const place = getPlaceById(id);
          if (!place) return null;
          return {
            id,
            position: { lat: place.latitude, lng: place.longitude },
            label: String(i + 1),
          };
        })
        .filter(Boolean) as { id: string; position: { lat: number; lng: number }; label: string }[],
    [stopIds]
  );

  const onLoad = useCallback(
    (instance: google.maps.Map) => setMap(instance),
    [setMap]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
    fittedKey.current = null;
  }, [setMap]);

  useEffect(() => {
    if (!map || polylinePath.length < 2 || typeof google === "undefined") return;
    if (fittedKey.current === polylineKey) return;
    fittedKey.current = polylineKey;
    const bounds = new google.maps.LatLngBounds();
    polylinePath.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 40);
  }, [map, polylinePath, polylineKey]);

  if (!isConfigured) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-charcoal/5 p-4 text-center text-xs ${className}`}>
        {t("routes.map.keyRequired")}
      </div>
    );
  }

  if (loadError) return <ErrorState message={loadError.message} />;
  if (!isLoaded) return <LoadingState label={t("routes.map.loading")} />;
  if (error) return <ErrorState message={t("routes.map.pathError")} />;

  return (
    <div className={`relative overflow-hidden rounded-xl ${className ?? "h-56"}`}>
      <GoogleMap
        mapContainerStyle={MAP_STYLE}
        center={TURKESTAN_CENTER}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={MAP_OPTIONS}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={m.position}
            label={{ text: m.label, color: "white", fontWeight: "bold" }}
          />
        ))}
        {polylinePath.length > 1 && (
          <Polyline path={polylinePath} options={POLYLINE_OPTIONS} />
        )}
      </GoogleMap>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
          <LoadingState label={t("routes.map.drawing")} />
        </div>
      )}

      {path && !loading && (
        <div className="absolute bottom-2 left-2 rounded-lg bg-white/95 px-2 py-1 text-[10px] shadow">
          {path.distanceKm} {t("common.km")} · {path.durationMin} {t("routes.stop.min")}
          {path.source === "estimated" && ` (${t("routes.map.estimated")})`}
        </div>
      )}
    </div>
  );
}

type Props = {
  route: Route;
  mode?: RouteTransportMode;
  className?: string;
};

export function RouteMapPreview({ route, mode, className }: Props) {
  const stopIds = useMemo(() => getRouteStopIds(route), [route.id]);
  const transportMode = mode ?? route.transportType;

  return (
    <GoogleMapProvider>
      <RouteMapInner stopIds={stopIds} mode={transportMode} className={className} />
    </GoogleMapProvider>
  );
}
