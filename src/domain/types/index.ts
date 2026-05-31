export type Locale = "kk" | "ru" | "en";

export type LocalizedString = Record<Locale, string>;

export type PlaceCategory =
  | "sacred"
  | "historical"
  | "museum"
  | "hotel"
  | "restaurant"
  | "transport"
  | "event"
  | "nature"
  | "market";

export type Place = {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  latitude: number;
  longitude: number;
  category: PlaceCategory;
  images: string[];
  /** Audio track IDs linked to this place */
  audioGuide: string[];
  /** QR content id (e.g. place id) or null if unavailable */
  qrCode: string | null;
  openingHours: LocalizedString;
  rating: number;
};

export type AudioTrack = {
  id: string;
  placeId: string;
  type: "intro" | "history" | "route" | "multilingual";
  title: LocalizedString;
  durationSec: number;
  transcript: LocalizedString;
  locale: Locale;
};

export type RoutePreset =
  | "1-day"
  | "2-day"
  | "historical"
  | "family"
  | "religious"
  | "night"
  | "budget";

export type RouteStop = {
  placeId: string;
  order: number;
  durationMin: number;
  transportMode: "walk" | "bus" | "car";
  note?: LocalizedString;
};

export type TouristRoute = {
  id: string;
  preset: RoutePreset;
  title: LocalizedString;
  description: LocalizedString;
  durationHours: number;
  totalWalkKm: number;
  stops: RouteStop[];
  tags: string[];
  difficulty: "easy" | "moderate" | "hard";
};

export type BookingListing = {
  id: string;
  type: "hotel" | "excursion" | "guide";
  name: LocalizedString;
  description: LocalizedString;
  pricePerNight?: number;
  pricePerPerson?: number;
  durationHours?: number;
  rating: number;
  reviewCount: number;
  location: LocalizedString;
  lat: number;
  lng: number;
  images: string[];
  amenities: LocalizedString[];
  cancellationPolicy: LocalizedString;
  includedServices: LocalizedString[];
  availability: { date: string; slots: number }[];
};

export type BookingRecord = {
  id: string;
  listingId: string;
  listingType: BookingListing["type"];
  listingName: string;
  checkIn: string;
  checkOut?: string;
  guests: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

export type Review = {
  id: string;
  placeId: string;
  author: string;
  avatar?: string;
  rating: number;
  text: string;
  helpful: number;
  createdAt: string;
  verified?: boolean;
};

export type QrContent = {
  placeId: string;
  summary: LocalizedString;
  history: LocalizedString;
  gallery: string[];
  audioGuide: string[];
};

export type OfficialInfo = {
  id: string;
  category: "hours" | "transport" | "weather" | "safety" | "rules" | "contacts";
  title: LocalizedString;
  body: LocalizedString;
  source: LocalizedString;
  lastUpdated: string;
};

export type FeedbackTicket = {
  id: string;
  type: "contact" | "bug" | "suggestion" | "complaint";
  name: string;
  email: string;
  message: string;
  category?: string;
  createdAt: string;
  status: "submitted";
};

export type AiRecommendation = {
  placeId: string;
  reason: LocalizedString;
  score: number;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  mode: "guest" | "registered";
};
