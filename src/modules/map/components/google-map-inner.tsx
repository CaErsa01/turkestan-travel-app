"use client";

import { useCallback, useEffect, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, Polyline, Circle } from "@react-google-maps/api";
import type { MapViewProps } from "../providers/types";
import { getGoogleMapsApiKey } from "../providers/config";
import { TURKESTAN_BOUNDS, MARKER_COLORS } from "../constants";
import type { MapLayerId } from "../types";

const mapContainerStyle = { width: "100%", height: "100%" };

const restriction = {
  latLngBounds: {
    north: TURKESTAN_BOUNDS.north,
    south: TURKESTAN_BOUNDS.south,
    east: TURKESTAN_BOUNDS.east,
    west: TURKESTAN_BOUNDS.west,
  },
  strictBounds: false,
};

export function GoogleMapInner({
  center,
  zoom,
  markers,
  routePolyline,
  userLocation,
  selectedMarkerId,
  onMarkerClick,
  onMapReady,
  onMapError,
  className,
}: MapViewProps) {
  const apiKey = getGoogleMapsApiKey() ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "turkistan-google-map",
    googleMapsApiKey: apiKey,
  });

  useEffect(() => {
    if (loadError) onMapError?.(loadError.message);
  }, [loadError, onMapError]);

  const onLoad = useCallback(() => onMapReady?.(), [onMapReady]);

  const polylinePath = useMemo(
    () => routePolyline.map((p) => ({ lat: p.lat, lng: p.lng })),
    [routePolyline]
  );

  if (!apiKey) {
    onMapError?.("Google Maps API key missing");
    return null;
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
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        options={{
          restriction,
          fullscreenControl: true,
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        <Circle
          center={center}
          radius={25000}
          options={{
            strokeColor: "#0D7377",
            strokeOpacity: 0.4,
            fillColor: "#0D7377",
            fillOpacity: 0.06,
          }}
        />
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#2563EB",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
            }}
            title="You"
          />
        )}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={m.position}
            onClick={() => onMarkerClick(m.id)}
            label={m.id === selectedMarkerId ? "★" : undefined}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: m.id === selectedMarkerId ? 10 : 7,
              fillColor: MARKER_COLORS[m.layer as MapLayerId] ?? "#0D7377",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
            title={m.label}
          />
        ))}
        {polylinePath.length > 1 && (
          <Polyline
            path={polylinePath}
            options={{ strokeColor: "#0D7377", strokeWeight: 4, strokeOpacity: 0.9 }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
