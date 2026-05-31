import {
  PLACES,
  TOURIST_ROUTES,
  BOOKING_LISTINGS,
  OFFICIAL_INFO,
  DEFAULT_REVIEWS,
  getPlaceById,
  getLocalized,
} from "@/domain/data/places";
import { TOUR_ROUTES } from "@/modules/routes/data/tour-routes";
import type { Locale, PlaceCategory } from "@/domain/types";
import type { AiPlaceRef, AiRoutePlan, AiRouteStop } from "../types";

export function placeToRef(placeId: string, locale: Locale): AiPlaceRef | null {
  const place = getPlaceById(placeId);
  if (!place) return null;
  return {
    id: place.id,
    name: getLocalized(place.name, locale),
    latitude: place.latitude,
    longitude: place.longitude,
    category: place.category,
    rating: place.rating,
    description: getLocalized(place.description, locale),
    openingHours: getLocalized(place.openingHours, locale),
  };
}

export function searchPlaces(params: {
  locale: Locale;
  query?: string;
  category?: PlaceCategory;
  minRating?: number;
  limit?: number;
}): AiPlaceRef[] {
  let results = [...PLACES];
  if (params.category) results = results.filter((p) => p.category === params.category);
  if (params.minRating != null) results = results.filter((p) => p.rating >= params.minRating!);

  if (params.query?.trim()) {
    const q = params.query.trim().toLowerCase();
    results = results.filter(
      (p) =>
        Object.values(p.name).some((n) => n.toLowerCase().includes(q)) ||
        Object.values(p.description).some((d) => d.toLowerCase().includes(q)) ||
        p.category.includes(q)
    );
  }

  return results.slice(0, params.limit ?? 10).map((p) => placeToRef(p.id, params.locale)!);
}

export function getPlaceDetails(placeId: string, locale: Locale) {
  const place = getPlaceById(placeId);
  if (!place) return null;
  const reviews = DEFAULT_REVIEWS.filter((r) => r.placeId === placeId).slice(0, 3);
  return {
    ...placeToRef(placeId, locale)!,
    audioGuideIds: place.audioGuide,
    qrCode: place.qrCode,
    reviews: reviews.map((r) => ({
      author: r.author,
      rating: r.rating,
      text: r.text,
    })),
  };
}

export function searchRoutes(params: {
  locale: Locale;
  preset?: string;
  maxDurationHours?: number;
  tags?: string[];
  maxBudgetKzt?: number;
}) {
  let routes = [...TOURIST_ROUTES];

  if (params.preset) {
    routes = routes.filter(
      (r) => r.preset === params.preset || r.tags.some((t) => t.includes(params.preset!))
    );
  }
  if (params.maxDurationHours) {
    routes = routes.filter((r) => r.durationHours <= params.maxDurationHours!);
  }
  if (params.tags?.length) {
    routes = routes.filter((r) => params.tags!.some((t) => r.tags.includes(t)));
  }

  return routes
    .map((r) => {
      const enriched = TOUR_ROUTES.find((tr) => tr.id === r.id);
      const basePrice = enriched?.pricing.basePriceKzt ?? null;
      return {
        id: r.id,
        title: getLocalized(r.title, params.locale),
        description: getLocalized(r.description, params.locale),
        durationHours: r.durationHours,
        difficulty: r.difficulty,
        tags: r.tags,
        preset: r.preset,
        totalWalkKm: r.totalWalkKm,
        stopIds: [...r.stops].sort((a, b) => a.order - b.order).map((s) => s.placeId),
        estimatedPriceKzt: basePrice,
      };
    })
    .filter((r) => (params.maxBudgetKzt ? (r.estimatedPriceKzt ?? 0) <= params.maxBudgetKzt : true));
}

export function getRouteDetails(routeId: string, locale: Locale) {
  const route = TOURIST_ROUTES.find((r) => r.id === routeId);
  if (!route) return null;
  const enriched = TOUR_ROUTES.find((tr) => tr.id === routeId);
  const stops: AiRouteStop[] = [...route.stops]
    .sort((a, b) => a.order - b.order)
    .map((s) => {
      const place = getPlaceById(s.placeId);
      return {
        placeId: s.placeId,
        order: s.order,
        name: place ? getLocalized(place.name, locale) : s.placeId,
        durationMin: s.durationMin,
        transportMode: s.transportMode,
        latitude: place?.latitude ?? 0,
        longitude: place?.longitude ?? 0,
      };
    });

  return {
    id: route.id,
    title: getLocalized(route.title, locale),
    description: getLocalized(route.description, locale),
    durationHours: route.durationHours,
    difficulty: route.difficulty,
    tags: route.tags,
    stops,
    stopIds: stops.map((s) => s.placeId),
    pricing: enriched?.pricing ?? null,
    rating: enriched?.rating ?? null,
    reviewCount: enriched?.reviewCount ?? null,
  };
}

export function searchBookings(params: {
  locale: Locale;
  type?: "hotel" | "excursion" | "guide";
  maxPrice?: number;
  minRating?: number;
  limit?: number;
}) {
  let listings = [...BOOKING_LISTINGS];
  if (params.type) listings = listings.filter((b) => b.type === params.type);
  if (params.minRating != null) listings = listings.filter((b) => b.rating >= params.minRating!);

  return listings
    .filter((b) => {
      const price = b.pricePerNight ?? b.pricePerPerson ?? 0;
      return params.maxPrice ? price <= params.maxPrice : true;
    })
    .slice(0, params.limit ?? 8)
    .map((b) => ({
      id: b.id,
      type: b.type,
      name: getLocalized(b.name, params.locale),
      description: getLocalized(b.description, params.locale),
      pricePerNight: b.pricePerNight ?? null,
      pricePerPerson: b.pricePerPerson ?? null,
      durationHours: b.durationHours ?? null,
      rating: b.rating,
      reviewCount: b.reviewCount,
      location: getLocalized(b.location, params.locale),
      lat: b.lat,
      lng: b.lng,
    }));
}

export function getOfficialInfo(topic: string, locale: Locale) {
  const q = topic.toLowerCase();
  const matches = OFFICIAL_INFO.filter(
    (info) =>
      info.category.toLowerCase().includes(q) ||
      Object.values(info.title).some((t) => t.toLowerCase().includes(q)) ||
      Object.values(info.body).some((b) => b.toLowerCase().includes(q))
  );
  const items = (matches.length > 0 ? matches : OFFICIAL_INFO).slice(0, 6);
  return items.map((info) => ({
    id: info.id,
    category: info.category,
    title: getLocalized(info.title, locale),
    body: getLocalized(info.body, locale),
    source: info.source ? getLocalized(info.source, locale) : null,
  }));
}

export function buildCustomRoutePlan(params: {
  locale: Locale;
  name: string;
  stopIds: string[];
  durationHours: number;
  budgetKzt?: number;
  transport: string;
  explanation: string;
}): AiRoutePlan | { error: string } {
  const uniqueIds = Array.from(new Set(params.stopIds));
  const stops: AiRouteStop[] = [];

  for (let i = 0; i < uniqueIds.length; i++) {
    const place = getPlaceById(uniqueIds[i]);
    if (!place) return { error: `Unknown place id: ${uniqueIds[i]}` };
    stops.push({
      placeId: place.id,
      order: i + 1,
      name: getLocalized(place.name, params.locale),
      durationMin: 60,
      transportMode: i === 0 ? "walk" : "walk",
      latitude: place.latitude,
      longitude: place.longitude,
    });
  }

  return {
    name: params.name,
    stopIds: uniqueIds,
    stops,
    durationHours: params.durationHours,
    budgetKzt: params.budgetKzt,
    transport: params.transport,
    explanation: params.explanation,
  };
}

export function buildCatalogSummary(locale: Locale): string {
  const placeLines = PLACES.map(
    (p) => `- ${p.id}: ${getLocalized(p.name, locale)} (${p.category}, ★${p.rating})`
  );
  const routeLines = TOURIST_ROUTES.map(
    (r) => `- ${r.id}: ${getLocalized(r.title, locale)} (~${r.durationHours}h)`
  );
  return [
    "Available place IDs (always verify details via tools):",
    ...placeLines,
    "",
    "Available route IDs:",
    ...routeLines,
  ].join("\n");
}
