import type { MapProviderId } from "../types";

/** Google Maps Platform is the primary provider */
export function getMapProviderFromEnv(): MapProviderId {
  const raw = (process.env.NEXT_PUBLIC_MAP_PROVIDER ?? "google").toLowerCase();

  if (raw === "google") {
    if (getGoogleMapsApiKey()) return "google";
    if (typeof window !== "undefined") {
      console.warn(
        "[Turkistan Map] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY missing — add key to .env.local"
      );
    }
    return "leaflet";
  }

  if (raw === "yandex" && getYandexMapsApiKey()) return "yandex";
  return "leaflet";
}

export function getGoogleMapsApiKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return key && key.length > 0 && !key.includes("your_google") ? key : undefined;
}

export function getYandexMapsApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
}

export function isGoogleMapsConfigured(): boolean {
  return !!getGoogleMapsApiKey();
}
