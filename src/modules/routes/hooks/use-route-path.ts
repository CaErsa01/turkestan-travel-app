"use client";

import { useEffect, useRef, useState } from "react";
import { useGoogleMap } from "@/modules/map/google/google-map-provider";
import { fetchGoogleDirections } from "@/modules/map/google/directions-service";
import { TURKESTAN_CENTER } from "@/modules/map/constants";
import { computeDirectionResult } from "@/modules/map/utils/route";
import { PLACES } from "@/domain/data/places";
import { placeForRouting } from "@/domain/place-utils";
import type { PlannedRoutePath, RouteTransportMode } from "../types";

export function useRoutePath(stopIds: string[], mode: RouteTransportMode) {
  const { isLoaded, map, directionsService } = useGoogleMap();
  const directionsRef = useRef(directionsService);
  directionsRef.current = directionsService;

  const requestId = useRef(0);
  const [path, setPath] = useState<PlannedRoutePath | null>(null);
  const [loading, setLoading] = useState(stopIds.length > 0);
  const [error, setError] = useState<string | null>(null);

  const stopKey = stopIds.join(",");

  useEffect(() => {
    if (stopIds.length === 0) {
      setPath(null);
      setLoading(false);
      return;
    }

    const id = ++requestId.current;
    setError(null);
    setLoading(true);
    const googleMode = mode === "driving" || mode === "mixed" ? "driving" : "walking";

    const run = async () => {
      const service = directionsRef.current;
      let result;
      if (isLoaded && service) {
        result = await fetchGoogleDirections(service, {
          origin: TURKESTAN_CENTER,
          stopIds,
          mode: googleMode,
          optimize: true,
        });
      }

      if (requestId.current !== id) return;

      if (result) {
        setPath({
          polyline: result.polyline,
          distanceKm: result.distanceKm,
          durationMin: result.durationMin,
          source: result.source,
        });
      } else {
        const fallback = computeDirectionResult(
          TURKESTAN_CENTER,
          PLACES.map(placeForRouting),
          stopIds,
          googleMode
        );
        setPath({
          polyline: fallback.polyline,
          distanceKm: fallback.distanceKm,
          durationMin: fallback.durationMin,
          source: "estimated",
        });
      }
      setLoading(false);
    };

    run().catch(() => {
      if (requestId.current === id) {
        setError("Failed to load route path");
        setLoading(false);
      }
    });
  }, [isLoaded, map, stopKey, mode]);

  return { path, loading, error };
}
