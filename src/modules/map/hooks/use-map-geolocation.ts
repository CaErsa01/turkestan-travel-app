"use client";

import { useCallback, useState } from "react";
import { useGoogleMap } from "../google/google-map-provider";
import { useMapModuleStore } from "../store/use-map-module-store";
import { TURKESTAN_CENTER } from "../constants";

export function useMapGeolocation() {
  const [loading, setLoading] = useState(false);
  const { map } = useGoogleMap();
  const setUserLocation = useMapModuleStore((s) => s.setUserLocation);
  const setGeoError = useMapModuleStore((s) => s.setGeoError);

  const requestLocation = useCallback(() => {
    const panToUser = (lat: number, lng: number) => {
      if (map) {
        map.panTo({ lat, lng });
        map.setZoom(Math.max(useMapModuleStore.getState().zoom, 14));
      }
    };

    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported");
      setUserLocation({
        lat: TURKESTAN_CENTER.lat,
        lng: TURKESTAN_CENTER.lng,
        timestamp: Date.now(),
      });
      return;
    }
    setLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({
          lat,
          lng,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
        panToUser(lat, lng);
        setLoading(false);
      },
      () => {
        setGeoError("Location denied — using Turkestan center");
        setUserLocation({
          lat: TURKESTAN_CENTER.lat,
          lng: TURKESTAN_CENTER.lng,
          timestamp: Date.now(),
        });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 }
    );
  }, [setUserLocation, setGeoError, map]);

  return { requestLocation, loading };
}
