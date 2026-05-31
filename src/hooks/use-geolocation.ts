"use client";

import { useCallback, useState } from "react";
import { useMapModuleStore } from "@/modules/map/store/use-map-module-store";
import { useAppStore } from "@/stores/use-app-store";
import { TURKESTAN_CENTER } from "@/modules/map/constants";

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUserLocation = useMapModuleStore((s) => s.setUserLocation);
  const showToast = useAppStore((s) => s.showToast);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
        setLoading(false);
        showToast("Location updated");
      },
      () => {
        setUserLocation({
          lat: TURKESTAN_CENTER.lat,
          lng: TURKESTAN_CENTER.lng,
          timestamp: Date.now(),
        });
        setLoading(false);
        setError("Using default Turkestan center");
        showToast("Using Turkestan center");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [setUserLocation, showToast]);

  return { requestLocation, loading, error };
}
