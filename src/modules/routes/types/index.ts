import type { LocalizedString } from "@/domain/types";

export type RoutePreset =
  | "1-day"
  | "2-day"
  | "historical"
  | "family"
  | "religious"
  | "night"
  | "budget"
  | "premium";

export type RouteCategory =
  | "sacred"
  | "historical"
  | "family"
  | "religious"
  | "budget"
  | "premium"
  | "night"
  | "culture";

export type RouteTransportMode = "walking" | "driving" | "mixed";

export type RouteStop = {
  placeId: string;
  order: number;
  durationMin: number;
  transportMode: "walk" | "bus" | "car";
  note?: LocalizedString;
  recommendedTime?: LocalizedString;
};

export type RoutePricing = {
  basePriceKzt: number;
  perPersonKzt: number;
  guideFeeKzt: number;
  transportFeeKzt: number;
  hotelAddonKzt: number;
  mealAddonKzt: number;
  excursionAddonKzt: number;
  premiumAddonKzt: number;
  groupDiscountPercent: number;
  earlyBookingDiscountPercent: number;
  studentDiscountPercent: number;
  familyDiscountPercent: number;
};

export type RouteReview = {
  id: string;
  author: string;
  rating: number;
  text: LocalizedString;
  createdAt: string;
};

export type RouteAvailability = {
  date: string;
  slots: number;
};

export type Route = {
  id: string;
  preset: RoutePreset;
  category: RouteCategory;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  shortSummary: LocalizedString;
  coverImage: string;
  durationHours: number;
  totalDistanceKm: number;
  difficulty: "easy" | "moderate" | "hard";
  tags: string[];
  stops: RouteStop[];
  pricing: RoutePricing;
  included: LocalizedString[];
  excluded: LocalizedString[];
  recommendedTimeOfDay: LocalizedString;
  transportType: RouteTransportMode;
  bestSeason: LocalizedString;
  accessibilityNotes: LocalizedString;
  bookingType: "self-guided" | "guided" | "premium";
  rating: number;
  reviewCount: number;
  popularity: number;
  bookingsCount: number;
  relatedRouteIds: string[];
  reviews: RouteReview[];
  availability: RouteAvailability[];
};

export type RouteSortBy =
  | "popular"
  | "cheapest"
  | "shortest"
  | "rating"
  | "booked";

export type RouteFilters = {
  preset: RoutePreset | "all";
  category: RouteCategory | "all";
  maxPrice: number | null;
  minRating: number;
  transportMode: RouteTransportMode | "all";
  familyFriendly: boolean;
  religious: boolean;
  historical: boolean;
  budget: boolean;
  premium: boolean;
  sortBy: RouteSortBy;
};

export type RouteBookingInput = {
  routeId: string;
  date: string;
  travelers: number;
  language: "kk" | "ru" | "en";
  transportMode: RouteTransportMode;
  includeGuide: boolean;
  includeHotel: boolean;
  includeMeals: boolean;
  includeExcursion: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

export type RouteBookingRecord = RouteBookingInput & {
  id: string;
  totalPriceKzt: number;
  breakdown: { labelKey: string; labelParams?: Record<string, string | number>; amountKzt: number }[];
  status: "confirmed" | "pending";
  createdAt: string;
};

export type CustomRoutePlan = {
  id: string;
  name: string;
  stopIds: string[];
  transportMode: RouteTransportMode;
  createdAt: string;
};

export type PlannedRoutePath = {
  polyline: { lat: number; lng: number }[];
  distanceKm: number;
  durationMin: number;
  source: "google" | "estimated";
};
