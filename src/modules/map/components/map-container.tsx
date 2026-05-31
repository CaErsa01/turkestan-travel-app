"use client";

import { useCallback, useEffect, useMemo } from "react";
import { GoogleMap, Polyline, Marker } from "@react-google-maps/api";
import { useGoogleMap } from "../google/google-map-provider";
import { useGoogleRouteDirections } from "../hooks/use-google-directions";
import { useMapPlaces } from "../hooks/use-map-places";
import { useMapModuleStore } from "../store/use-map-module-store";
import { MarkerLayer } from "./marker-layer";
import { TURKESTAN_CENTER, TURKESTAN_BOUNDS } from "../constants";
import { buildUserIcon } from "../google/marker-icons";

const MAP_STYLE = { width: "100%", height: "100%" };

const BOUNDS = {
  north: TURKESTAN_BOUNDS.north,
  south: TURKESTAN_BOUNDS.south,
  east: TURKESTAN_BOUNDS.east,
  west: TURKESTAN_BOUNDS.west,
};

type Props = {
  className?: string;
  onMarkerClick: (id: string) => void;
};

export function MapContainer({ className, onMarkerClick }: Props) {
  const { isLoaded, isConfigured, loadError, setMap, map } = useGoogleMap();
  const { markers } = useMapPlaces();
  useGoogleRouteDirections();

  const selectedPlaceId = useMapModuleStore((s) => s.selectedPlaceId);
  const userLocation = useMapModuleStore((s) => s.userLocation);
  const plannedRoute = useMapModuleStore((s) => s.plannedRoute);
  const zoom = useMapModuleStore((s) => s.zoom);
  const setProviderStatus = useMapModuleStore((s) => s.setProviderStatus);

  const polylinePath = useMemo(
    () => plannedRoute?.polyline.map((p) => ({ lat: p.lat, lng: p.lng })) ?? [],
    [plannedRoute]
  );

  const onLoad = useCallback(
    (instance: google.maps.Map) => {
      setMap(instance);
      setProviderStatus("ready");
    },
    [setMap, setProviderStatus]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, [setMap]);

  useEffect(() => {
    if (loadError) setProviderStatus("error", loadError.message);
  }, [loadError, setProviderStatus]);

  useEffect(() => {
    if (!map || polylinePath.length < 2 || typeof google === "undefined") return;
    const bounds = new google.maps.LatLngBounds();
    polylinePath.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 48);
  }, [map, polylinePath]);

  if (!isConfigured) {
    return (
      <div className={`flex items-center justify-center bg-charcoal/5 p-6 text-center ${className}`}>
        <div>
          <p className="font-semibold text-charcoal">Google Maps API key required</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Add <code className="rounded bg-charcoal/10 px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to{" "}
            <code className="rounded bg-charcoal/10 px-1">.env.local</code>
          </p>
          <p className="mt-1 text-xs text-charcoal/50">
            Enable: Maps JavaScript API, Places API, Directions API, Geocoding API
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-charcoal/5 ${className}`}>
        <p className="text-sm text-charcoal/60">Loading Google Maps…</p>
      </div>
    );
  }

  return (
    <div className={className ?? "h-full w-full"}>
      <GoogleMap
        mapContainerStyle={MAP_STYLE}
        center={TURKESTAN_CENTER}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          restriction: { latLngBounds: BOUNDS, strictBounds: false },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        }}
      >
        <MarkerLayer
          map={map}
          markers={markers}
          selectedPlaceId={selectedPlaceId}
          onMarkerClick={onMarkerClick}
          enabled={isLoaded}
        />
        {userLocation && typeof google !== "undefined" && (
          <Marker
            position={{ lat: userLocation.lat, lng: userLocation.lng }}
            icon={buildUserIcon(google.maps)}
            title="Your location"
          />
        )}
        {polylinePath.length > 1 && (
          <Polyline
            path={polylinePath}
            options={{ strokeColor: "#0D7377", strokeWeight: 5, strokeOpacity: 0.9 }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
