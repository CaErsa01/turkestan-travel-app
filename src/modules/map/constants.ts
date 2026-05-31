import type { PlaceCategory } from "@/domain/types";
import type { LatLng, MapLayerId } from "./types";

export const TURKESTAN_CENTER: LatLng = { lat: 43.2974, lng: 68.2719 };

export const TURKESTAN_DEFAULT_ZOOM = 13;

/** Tourism coverage area around Turkestan */
export const TURKESTAN_BOUNDS = {
  north: 43.42,
  south: 43.18,
  east: 68.58,
  west: 68.12,
};

export const TOURISM_RADIUS_KM = 30;

export const CATEGORY_TO_LAYER: Record<PlaceCategory, MapLayerId> = {
  sacred: "historical",
  historical: "historical",
  museum: "historical",
  nature: "historical",
  hotel: "stay",
  restaurant: "food",
  market: "food",
  transport: "transport",
  event: "events",
};

export const LAYER_LABELS: Record<MapLayerId, { kk: string; ru: string; en: string }> = {
  historical: { kk: "Тарихи", ru: "Исторические", en: "Historical" },
  food: { kk: "Тамақ", ru: "Еда", en: "Food" },
  stay: { kk: "Қонақ үй", ru: "Проживание", en: "Stay" },
  transport: { kk: "Көлік", ru: "Транспорт", en: "Transport" },
  events: { kk: "Іс-шара", ru: "События", en: "Events" },
  services: { kk: "Қызмет", ru: "Сервисы", en: "Services" },
};

export const MARKER_COLORS: Record<MapLayerId, string> = {
  historical: "#C69C55",
  food: "#E74C3C",
  stay: "#3498DB",
  transport: "#7F8C8D",
  events: "#9B59B6",
  services: "#0D7377",
};

export const DEFAULT_LAYERS: Record<MapLayerId, boolean> = {
  historical: true,
  food: true,
  stay: true,
  transport: true,
  events: true,
  services: true,
};
