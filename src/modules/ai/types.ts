import type { Locale } from "@/domain/types";

export type AiUserPreferences = {
  interests: string[];
  mobility: string;
  budgetKzt?: number;
  durationDays?: number;
  travelingWithChildren?: boolean;
  language?: Locale;
};

export type AiPlaceRef = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  rating: number;
  description?: string;
  openingHours?: string;
};

export type AiRouteStop = {
  placeId: string;
  order: number;
  name: string;
  durationMin: number;
  transportMode: string;
  latitude: number;
  longitude: number;
};

export type AiRoutePlan = {
  name: string;
  stopIds: string[];
  stops: AiRouteStop[];
  durationHours: number;
  budgetKzt?: number;
  transport: string;
  explanation: string;
  routeId?: string;
};

export type AiSuggestedActionType =
  | "open_map"
  | "open_place"
  | "open_route"
  | "load_route_on_map"
  | "view_hotels"
  | "open_audio"
  | "book_excursion";

export type AiSuggestedAction = {
  type: AiSuggestedActionType;
  label: string;
  placeId?: string;
  routeId?: string;
  stopIds?: string[];
  href?: string;
};

export type AiResponseMetadata = {
  places: AiPlaceRef[];
  routePlan?: AiRoutePlan;
  actions: AiSuggestedAction[];
};

export type AiChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  metadata?: AiResponseMetadata;
  isStreaming?: boolean;
};

export type ApiChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AiChatRequestBody = {
  messages: ApiChatMessage[];
  locale: Locale;
  preferences?: AiUserPreferences;
  sessionId?: string;
};

export type AiStreamEvent =
  | { type: "token"; content: string }
  | { type: "metadata"; data: AiResponseMetadata }
  | { type: "error"; message: string }
  | { type: "done" };
