import { TURKESTAN_CENTER, TOURISM_RADIUS_KM } from "../constants";
import type { LatLng } from "../types";

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function isWithinTourismArea(point: LatLng): boolean {
  return haversineKm(TURKESTAN_CENTER, point) <= TOURISM_RADIUS_KM;
}

export function formatDistance(km: number | null, locale: string): string {
  if (km === null) return "—";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
