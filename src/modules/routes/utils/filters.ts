import type { Route, RouteFilters } from "../types";
import { estimateDisplayPrice } from "./pricing";

export const DEFAULT_ROUTE_FILTERS: RouteFilters = {
  preset: "all",
  category: "all",
  maxPrice: null,
  minRating: 0,
  transportMode: "all",
  familyFriendly: false,
  religious: false,
  historical: false,
  budget: false,
  premium: false,
  sortBy: "popular",
};

export function filterAndSortRoutes(routes: Route[], filters: RouteFilters): Route[] {
  let list = [...routes];

  if (filters.preset !== "all") list = list.filter((r) => r.preset === filters.preset);
  if (filters.category !== "all") list = list.filter((r) => r.category === filters.category);
  if (filters.minRating > 0) list = list.filter((r) => r.rating >= filters.minRating);
  if (filters.maxPrice != null) {
    list = list.filter((r) => estimateDisplayPrice(r) <= filters.maxPrice!);
  }
  if (filters.transportMode !== "all") {
    list = list.filter((r) => r.transportType === filters.transportMode);
  }
  if (filters.familyFriendly) list = list.filter((r) => r.tags.includes("family") || r.category === "family");
  if (filters.religious) list = list.filter((r) => r.tags.includes("religious") || r.category === "religious");
  if (filters.historical) list = list.filter((r) => r.tags.includes("historical") || r.category === "historical");
  if (filters.budget) list = list.filter((r) => r.preset === "budget" || r.tags.includes("budget"));
  if (filters.premium) list = list.filter((r) => r.preset === "premium" || r.category === "premium");

  switch (filters.sortBy) {
    case "cheapest":
      list.sort((a, b) => estimateDisplayPrice(a) - estimateDisplayPrice(b));
      break;
    case "shortest":
      list.sort((a, b) => a.durationHours - b.durationHours);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "booked":
      list.sort((a, b) => b.bookingsCount - a.bookingsCount);
      break;
    case "popular":
    default:
      list.sort((a, b) => b.popularity - a.popularity);
  }

  return list;
}
