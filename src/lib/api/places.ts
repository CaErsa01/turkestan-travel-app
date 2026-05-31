import { apiCall } from "@/lib/api/client";
import {
  PLACES,
  BOOKING_LISTINGS,
  AUDIO_TRACKS,
  QR_CONTENT,
  OFFICIAL_INFO,
  DEFAULT_REVIEWS,
  getPlaceById,
} from "@/domain/data/places";
import type { PlaceCategory } from "@/domain/types";

export async function fetchPlaces(filters?: {
  category?: PlaceCategory | "all";
  minRating?: number;
  search?: string;
}) {
  return apiCall(() => {
    let list = [...PLACES];
    if (filters?.category && filters.category !== "all") {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters?.minRating) {
      list = list.filter((p) => p.rating >= filters.minRating!);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.kk.toLowerCase().includes(q) ||
          p.name.en.toLowerCase().includes(q) ||
          p.name.ru.toLowerCase().includes(q) ||
          p.description.en.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.rating - a.rating);
  });
}

export async function fetchPlace(id: string) {
  return apiCall(() => {
    const place = getPlaceById(id);
    if (!place) throw { code: "NOT_FOUND", message: "Place not found" };
    return place;
  });
}

export async function fetchRoutes() {
  const { TOUR_ROUTES } = await import("@/modules/routes/data/tour-routes");
  return apiCall(() => TOUR_ROUTES);
}

export async function fetchRoute(id: string) {
  const { getTourRouteById } = await import("@/modules/routes/data/tour-routes");
  return apiCall(() => {
    const route = getTourRouteById(id);
    if (!route) throw { code: "NOT_FOUND", message: "Route not found" };
    return route;
  });
}

export async function fetchBookings() {
  return apiCall(() => BOOKING_LISTINGS);
}

export async function fetchBookingListing(id: string) {
  return apiCall(() => {
    const item = BOOKING_LISTINGS.find((b) => b.id === id);
    if (!item) throw { code: "NOT_FOUND", message: "Listing not found" };
    return item;
  });
}

export async function fetchAudioTracks(placeId?: string) {
  return apiCall(() =>
    placeId ? AUDIO_TRACKS.filter((t) => t.placeId === placeId) : AUDIO_TRACKS
  );
}

export async function fetchQrContent(id: string) {
  return apiCall(() => {
    const content = QR_CONTENT[id];
    if (!content) throw { code: "INVALID_QR", message: "Invalid QR code" };
    return content;
  });
}

export async function fetchOfficialInfo() {
  return apiCall(() => OFFICIAL_INFO);
}

export async function fetchReviews(placeId?: string) {
  return apiCall(() =>
    placeId ? DEFAULT_REVIEWS.filter((r) => r.placeId === placeId) : DEFAULT_REVIEWS
  );
}
