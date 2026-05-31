"use client";

import { useEffect, useRef } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { buildMarkerIcon, getMarkerColor } from "../google/marker-icons";
import type { MapMarker } from "../types";

type Props = {
  map: google.maps.Map | null;
  markers: MapMarker[];
  selectedPlaceId: string | null;
  onMarkerClick: (id: string) => void;
  enabled: boolean;
};

/** Renders clustered tourism markers on the Google map instance. */
export function MarkerLayer({
  map,
  markers,
  selectedPlaceId,
  onMarkerClick,
  enabled,
}: Props) {
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markerRefs = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!enabled || !map || typeof google === "undefined") return;

    markerRefs.current.forEach((m) => m.setMap(null));
    markerRefs.current = [];
    clustererRef.current?.clearMarkers();

    const gMarkers = markers.map((m) => {
      const selected = m.id === selectedPlaceId;
      const marker = new google.maps.Marker({
        position: m.position,
        title: m.label,
        icon: buildMarkerIcon(google.maps, getMarkerColor(m.category), selected),
        zIndex: selected ? 1000 : 1,
      });
      marker.addListener("click", () => onMarkerClick(m.id));
      return marker;
    });

    markerRefs.current = gMarkers;
    clustererRef.current = new MarkerClusterer({ map, markers: gMarkers });

    return () => {
      clustererRef.current?.clearMarkers();
      markerRefs.current.forEach((m) => m.setMap(null));
      markerRefs.current = [];
    };
  }, [enabled, map, markers, selectedPlaceId, onMarkerClick]);

  return null;
}
