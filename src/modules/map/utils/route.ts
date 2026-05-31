import type { RouteMode } from "../types";

const SPEED_KMH: Record<RouteMode, number> = {
  walking: 5,
  driving: 35,
};

export function buildRoutePolyline(
  start: { lat: number; lng: number } | null,
  places: { id: string; lat: number; lng: number }[],
  stopIds: string[]
): { lat: number; lng: number }[] {
  const ordered = stopIds
    .map((id) => places.find((p) => p.id === id))
    .filter((p): p is { id: string; lat: number; lng: number } => !!p);
  const points: { lat: number; lng: number }[] = [];
  if (start) points.push(start);
  for (const p of ordered) points.push({ lat: p.lat, lng: p.lng });
  return points;
}

export function estimateRoute(
  polyline: { lat: number; lng: number }[],
  mode: RouteMode
) {
  let distanceKm = 0;
  for (let i = 1; i < polyline.length; i++) {
    const a = polyline[i - 1];
    const b = polyline[i];
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a.lat * Math.PI) / 180) *
        Math.cos((b.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    distanceKm += R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }
  const roadFactor = mode === "walking" ? 1.25 : 1.4;
  distanceKm *= roadFactor;
  const durationMin = Math.round((distanceKm / SPEED_KMH[mode]) * 60);
  return { distanceKm: Math.round(distanceKm * 10) / 10, durationMin };
}

export function computeDirectionResult(
  start: { lat: number; lng: number } | null,
  places: { id: string; lat: number; lng: number }[],
  stopIds: string[],
  mode: RouteMode
) {
  const polyline = buildRoutePolyline(start, places, stopIds);
  const { distanceKm, durationMin } = estimateRoute(polyline, mode);
  return {
    polyline,
    distanceKm,
    durationMin,
    steps: [] as { instruction: string; distance: string; duration: string }[],
    source: "estimated" as const,
  };
}
