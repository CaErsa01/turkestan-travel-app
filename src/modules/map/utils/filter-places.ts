import type { Place } from "@/domain/types";
import { toLatLng } from "@/domain/place-utils";
import type { MapFilter, PlaceMapSummary, UserLocation } from "../types";
import { CATEGORY_TO_LAYER } from "../constants";
import { haversineKm, isWithinTourismArea } from "./geo";
import { TURKESTAN_CENTER } from "../constants";

export function placeToSummary(
  place: Place,
  userLocation: UserLocation | null
): PlaceMapSummary {
  const layer = CATEGORY_TO_LAYER[place.category];
  const from = userLocation ?? TURKESTAN_CENTER;
  const coords = toLatLng(place);
  const distanceKm = haversineKm(from, coords);
  return { ...place, layer, distanceKm: userLocation ? distanceKm : null };
}

export function filterAndSortPlaces(
  places: Place[],
  filter: MapFilter,
  userLocation: UserLocation | null
): PlaceMapSummary[] {
  let list = places.filter((p) => isWithinTourismArea(toLatLng(p)));

  const q = filter.search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p) =>
        p.name.kk.toLowerCase().includes(q) ||
        p.name.ru.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q) ||
        p.description.kk.toLowerCase().includes(q) ||
        p.description.en.toLowerCase().includes(q)
    );
  }

  if (filter.historicalOnly) {
    list = list.filter((p) => CATEGORY_TO_LAYER[p.category] === "historical");
  }

  if (filter.categories.length > 0) {
    list = list.filter((p) => filter.categories.includes(p.category));
  }

  list = list.filter((p) => {
    const layer = CATEGORY_TO_LAYER[p.category];
    return filter.layers[layer] ?? true;
  });

  if (filter.minRating > 0) {
    list = list.filter((p) => p.rating >= filter.minRating);
  }

  if (filter.openNowOnly) {
    // openingHours-based live status can be wired to a backend later
  }

  let summaries = list.map((p) => placeToSummary(p, userLocation));

  if (filter.nearMeOnly && userLocation) {
    summaries = summaries.filter((p) => (p.distanceKm ?? 999) <= filter.maxDistanceKm);
  }

  switch (filter.sortBy) {
    case "nearest":
      summaries.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
      break;
    case "rating":
      summaries.sort((a, b) => b.rating - a.rating);
      break;
    case "open":
      summaries.sort((a, b) => b.rating - a.rating);
      break;
    case "popularity":
    default:
      summaries.sort((a, b) => b.rating - a.rating);
  }

  return summaries;
}
