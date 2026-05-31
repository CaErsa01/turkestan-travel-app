"use client";

import { useEffect, useRef } from "react";
import { useGoogleMap } from "../google/google-map-provider";
import { useMapModuleStore } from "../store/use-map-module-store";
import { fetchGoogleDirections } from "../google/directions-service";
import { TURKESTAN_CENTER } from "../constants";
import { PLACES } from "@/domain/data/places";
import { placeForRouting } from "@/domain/place-utils";
import { computeDirectionResult } from "../utils/route";

/** Sync route stops → Google Directions API → store */
export function useGoogleRouteDirections() {
  const { isLoaded, directionsService } = useGoogleMap();
  const routeStopIds = useMapModuleStore((s) => s.routeStopIds);
  const routeMode = useMapModuleStore((s) => s.routeMode);
  const userLocation = useMapModuleStore((s) => s.userLocation);
  const setPlannedRoute = useMapModuleStore((s) => s.setPlannedRoute);
  const setRouteStopIds = useMapModuleStore((s) => s.setRouteStopIds);

  const requestId = useRef(0);

  useEffect(() => {
    if (routeStopIds.length === 0) {
      const current = useMapModuleStore.getState().plannedRoute;
      if (current !== null) setPlannedRoute(null);
      return;
    }

    const id = ++requestId.current;
    const origin = userLocation
      ? { lat: userLocation.lat, lng: userLocation.lng }
      : TURKESTAN_CENTER;

    const run = async () => {
      let result;
      if (isLoaded && directionsService) {
        result = await fetchGoogleDirections(directionsService, {
          origin,
          stopIds: routeStopIds,
          mode: routeMode,
          optimize: true,
        });
      }
      if (requestId.current !== id) return;

      if (result) {
        if (
          result.optimizedStopIds &&
          result.optimizedStopIds.join(",") !== routeStopIds.join(",")
        ) {
          setRouteStopIds(result.optimizedStopIds);
        }
        setPlannedRoute({
          stops: (result.optimizedStopIds ?? routeStopIds).map((placeId, order) => ({
            placeId,
            order,
          })),
          mode: routeMode,
          polyline: result.polyline,
          encodedPolyline: result.encodedPolyline,
          distanceKm: result.distanceKm,
          durationMin: result.durationMin,
          steps: result.steps,
          source: result.source,
        });
      } else {
        const fallback = computeDirectionResult(origin, PLACES.map(placeForRouting), routeStopIds, routeMode);
        setPlannedRoute({
          stops: routeStopIds.map((placeId, order) => ({ placeId, order })),
          mode: routeMode,
          polyline: fallback.polyline,
          distanceKm: fallback.distanceKm,
          durationMin: fallback.durationMin,
          steps: [],
          source: "estimated",
        });
      }
    };

    run();
  }, [isLoaded, directionsService, routeStopIds, routeMode, userLocation, setPlannedRoute, setRouteStopIds]);
}
