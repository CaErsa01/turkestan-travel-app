import type { Place, PlaceCategory } from "@/domain/types";

export type MapProviderId = "leaflet" | "google" | "yandex";

export type LatLng = { lat: number; lng: number };

export type MapLayerId =
  | "historical"
  | "food"
  | "stay"
  | "transport"
  | "events"
  | "services";

/** walking | driving per Google Directions travel modes */
export type RouteMode = "walking" | "driving";

export type MapSortBy = "nearest" | "rating" | "popularity" | "open";

export type MapMarker = {
  id: string;
  position: LatLng;
  category: PlaceCategory;
  layer: MapLayerId;
  label: string;
};

export type MapFilter = {
  search: string;
  categories: PlaceCategory[];
  layers: Record<MapLayerId, boolean>;
  minRating: number;
  openNowOnly: boolean;
  historicalOnly: boolean;
  nearMeOnly: boolean;
  maxDistanceKm: number;
  sortBy: MapSortBy;
  nearbyCategory: PlaceCategory | "all";
};

export type UserLocation = {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
};

export type RouteStop = {
  placeId: string;
  order: number;
};

export type RouteStep = {
  instruction: string;
  distance: string;
  duration: string;
};

export type PlannedRoute = {
  id?: string;
  name?: string;
  stops: RouteStop[];
  mode: RouteMode;
  polyline: LatLng[];
  encodedPolyline?: string;
  distanceKm: number;
  durationMin: number;
  steps: RouteStep[];
  source: "google" | "estimated";
  savedAt?: string;
};

export type DirectionResult = {
  polyline: LatLng[];
  encodedPolyline?: string;
  distanceKm: number;
  durationMin: number;
  steps: RouteStep[];
  source: "google" | "estimated";
  /** Stop order after Google waypoint optimization */
  optimizedStopIds?: string[];
};

export type PlaceMapSummary = Place & {
  distanceKm: number | null;
  layer: MapLayerId;
};

export type SavedRouteRecord = {
  id: string;
  name: string;
  stopIds: string[];
  mode: RouteMode;
  distanceKm: number;
  durationMin: number;
  savedAt: string;
};

export type RecentPlaceRecord = {
  placeId: string;
  viewedAt: string;
};

export type MapProviderStatus = "idle" | "loading" | "ready" | "error";

export type GooglePlacePrediction = {
  placeId: string;
  description: string;
  mainText: string;
};
