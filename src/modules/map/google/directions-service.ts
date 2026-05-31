import type { LatLng, RouteMode, RouteStep, DirectionResult } from "../types";
import { computeDirectionResult } from "../utils/route";
import { PLACES, getPlaceById } from "@/domain/data/places";
import { placeForRouting } from "@/domain/place-utils";

function decodeOverviewPath(
  overviewPath: google.maps.LatLng[] | undefined
): LatLng[] {
  if (!overviewPath) return [];
  return overviewPath.map((p) => ({ lat: p.lat(), lng: p.lng() }));
}

function extractSteps(route: google.maps.DirectionsRoute): RouteStep[] {
  const steps: RouteStep[] = [];
  for (const leg of route.legs ?? []) {
    for (const step of leg.steps ?? []) {
      steps.push({
        instruction: step.instructions?.replace(/<[^>]*>/g, "") ?? "",
        distance: step.distance?.text ?? "",
        duration: step.duration?.text ?? "",
      });
    }
  }
  return steps;
}

function totalLegStats(route: google.maps.DirectionsRoute) {
  let meters = 0;
  let seconds = 0;
  for (const leg of route.legs ?? []) {
    meters += leg.distance?.value ?? 0;
    seconds += leg.duration?.value ?? 0;
  }
  return {
    distanceKm: Math.round((meters / 1000) * 10) / 10,
    durationMin: Math.round(seconds / 60),
  };
}

export type FetchDirectionsParams = {
  origin: LatLng;
  stopIds: string[];
  mode: RouteMode;
  optimize?: boolean;
};

export async function fetchGoogleDirections(
  service: google.maps.DirectionsService,
  params: FetchDirectionsParams
): Promise<DirectionResult | null> {
  const { origin, stopIds, mode, optimize = true } = params;
  if (stopIds.length === 0) return null;

  const stops = stopIds
    .map((id) => getPlaceById(id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  if (stops.length === 0) return null;

  const destination = stops[stops.length - 1];
  const waypoints = stops.slice(0, -1).map((p) => ({
    location: { lat: p.latitude, lng: p.longitude },
    stopover: true,
  }));

  const travelMode =
    mode === "walking"
      ? google.maps.TravelMode.WALKING
      : google.maps.TravelMode.DRIVING;

  return new Promise((resolve) => {
    service.route(
      {
        origin,
        destination: { lat: destination.latitude, lng: destination.longitude },
        waypoints: waypoints.length > 0 ? waypoints : undefined,
        optimizeWaypoints: optimize && waypoints.length > 1,
        travelMode,
      },
      (result, status) => {
        if (status !== google.maps.DirectionsStatus.OK || !result?.routes[0]) {
          const fallback = computeDirectionResult(
            origin,
            PLACES.map(placeForRouting),
            stopIds,
            mode === "walking" ? "walking" : "driving"
          );
          resolve({ ...fallback, steps: [], source: "estimated" });
          return;
        }

        const route = result.routes[0];
        const { distanceKm, durationMin } = totalLegStats(route);

        let optimizedStopIds: string[] | undefined;
        if (waypoints.length > 1 && route.waypoint_order?.length) {
          const waypointIds = stopIds.slice(0, -1);
          const destId = stopIds[stopIds.length - 1];
          optimizedStopIds = [
            ...route.waypoint_order.map((i) => waypointIds[i]),
            destId,
          ];
        }

        resolve({
          polyline: decodeOverviewPath(route.overview_path),
          encodedPolyline: route.overview_polyline,
          distanceKm,
          durationMin,
          steps: extractSteps(route),
          source: "google",
          optimizedStopIds,
        });
      }
    );
  });
}

/** Single leg: user → place */
export async function fetchDirectionsToPlace(
  service: google.maps.DirectionsService,
  origin: LatLng,
  dest: LatLng,
  mode: RouteMode
): Promise<DirectionResult | null> {
  const travelMode =
    mode === "walking"
      ? google.maps.TravelMode.WALKING
      : google.maps.TravelMode.DRIVING;

  return new Promise((resolve) => {
    service.route(
      { origin, destination: dest, travelMode },
      (result, status) => {
        if (status !== google.maps.DirectionsStatus.OK || !result?.routes[0]) {
          resolve(null);
          return;
        }
        const route = result.routes[0];
        const { distanceKm, durationMin } = totalLegStats(route);
        resolve({
          polyline: decodeOverviewPath(route.overview_path),
          distanceKm,
          durationMin,
          steps: extractSteps(route),
          source: "google",
        });
      }
    );
  });
}
