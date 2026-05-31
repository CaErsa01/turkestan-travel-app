import type { Place } from "@/domain/types";
import { haversineKm } from "@/lib/utils/geo";

export function toLatLng(place: Place): { lat: number; lng: number } {
  return { lat: place.latitude, lng: place.longitude };
}

export function placeForRouting(place: Place): { id: string; lat: number; lng: number } {
  return { id: place.id, lat: place.latitude, lng: place.longitude };
}

export function hasQrCode(place: Place): boolean {
  return place.qrCode !== null;
}

export function hasAudioGuide(place: Place): boolean {
  return place.audioGuide.length > 0;
}

export function getNearbyPlaces(
  place: Place,
  all: Place[],
  limit = 3,
  maxKm = 20
): Place[] {
  return all
    .filter((p) => p.id !== place.id)
    .map((p) => ({
      place: p,
      km: haversineKm(place.latitude, place.longitude, p.latitude, p.longitude),
    }))
    .filter((x) => x.km <= maxKm)
    .sort((a, b) => a.km - b.km)
    .slice(0, limit)
    .map((x) => x.place);
}
