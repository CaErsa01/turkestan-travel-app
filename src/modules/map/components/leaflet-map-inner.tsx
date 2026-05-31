"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapViewProps } from "../providers/types";
import { TURKESTAN_BOUNDS, MARKER_COLORS } from "../constants";
import type { MapLayerId } from "../types";

function createColoredIcon(color: string, selected: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${selected ? 18 : 14}px;height:${selected ? 18 : 14}px;
      background:${color};border:2px solid white;border-radius:50%;
      box-shadow:0 2px 8px rgba(0,0,0,.35);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function MapController({
  center,
  zoom,
  routePolyline,
}: {
  center: { lat: number; lng: number };
  zoom: number;
  routePolyline: { lat: number; lng: number }[];
}) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [map, center.lat, center.lng, zoom]);

  useEffect(() => {
    if (routePolyline.length > 1) {
      const bounds = L.latLngBounds(routePolyline.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
    }
  }, [map, routePolyline]);

  return null;
}

export function LeafletMapInner({
  center,
  zoom,
  markers,
  routePolyline,
  userLocation,
  selectedMarkerId,
  onMarkerClick,
  onMapReady,
  className,
}: MapViewProps) {
  useEffect(() => {
    onMapReady?.();
  }, [onMapReady]);

  const bounds = useMemo(
    () =>
      [
        [TURKESTAN_BOUNDS.south, TURKESTAN_BOUNDS.west],
        [TURKESTAN_BOUNDS.north, TURKESTAN_BOUNDS.east],
      ] as L.LatLngBoundsExpression,
    []
  );

  return (
    <div className={className ?? "h-full w-full"}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="h-full w-full z-0"
        maxBounds={bounds}
        maxBoundsViscosity={0.85}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} zoom={zoom} routePolyline={routePolyline} />

        {/* Tourism area hint */}
        <Circle
          center={[center.lat, center.lng]}
          radius={25000}
          pathOptions={{
            color: "#0D7377",
            fillColor: "#0D7377",
            fillOpacity: 0.04,
            weight: 1,
            dashArray: "6 8",
          }}
        />

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createColoredIcon("#2563EB", true)}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.position.lat, m.position.lng]}
            icon={createColoredIcon(
              MARKER_COLORS[m.layer as MapLayerId] ?? "#0D7377",
              m.id === selectedMarkerId
            )}
            eventHandlers={{ click: () => onMarkerClick(m.id) }}
          >
            <Popup>{m.label}</Popup>
          </Marker>
        ))}

        {routePolyline.length > 1 && (
          <Polyline
            positions={routePolyline.map((p) => [p.lat, p.lng] as [number, number])}
            pathOptions={{ color: "#0D7377", weight: 4, opacity: 0.85 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
