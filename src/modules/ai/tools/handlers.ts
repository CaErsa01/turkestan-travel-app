import type { Locale, PlaceCategory } from "@/domain/types";
import type { AiPlaceRef, AiResponseMetadata, AiRoutePlan } from "../types";
import {
  searchPlaces,
  getPlaceDetails,
  searchRoutes,
  getRouteDetails,
  searchBookings,
  getOfficialInfo,
  buildCustomRoutePlan,
  placeToRef,
} from "../knowledge/tourism-knowledge";

export type MetadataCollector = {
  places: Map<string, AiPlaceRef>;
  routePlan?: AiRoutePlan;
  routeId?: string;
  addPlace: (ref: AiPlaceRef) => void;
  setRoutePlan: (plan: AiRoutePlan) => void;
  setRouteId: (id: string) => void;
  finalize: (locale: Locale) => AiResponseMetadata;
};

export function createMetadataCollector(): MetadataCollector {
  const places = new Map<string, AiPlaceRef>();
  let routePlan: AiRoutePlan | undefined;
  let routeId: string | undefined;

  return {
    places,
    get routePlan() {
      return routePlan;
    },
    get routeId() {
      return routeId;
    },
    addPlace(ref) {
      places.set(ref.id, ref);
    },
    setRoutePlan(plan) {
      routePlan = plan;
      for (const stop of plan.stops) {
        const ref = placeToRef(stop.placeId, "en");
        if (ref) places.set(ref.id, ref);
      }
    },
    setRouteId(id) {
      routeId = id;
    },
    finalize(locale) {
      const placeList = Array.from(places.values());
      const actions: AiResponseMetadata["actions"] = [];

      if (routePlan) {
        actions.push({
          type: "load_route_on_map",
          label: actionLabel("map", locale),
          stopIds: routePlan.stopIds,
        });
        actions.push({
          type: "view_hotels",
          label: actionLabel("hotels", locale),
          href: "/booking",
        });
      } else if (routeId) {
        actions.push({
          type: "open_route",
          label: actionLabel("route", locale),
          routeId,
        });
        actions.push({
          type: "load_route_on_map",
          label: actionLabel("map", locale),
          routeId,
        });
      }

      for (const place of placeList.slice(0, 4)) {
        actions.push({
          type: "open_place",
          label: place.name,
          placeId: place.id,
        });
      }

      if (placeList.length > 0) {
        actions.push({
          type: "open_map",
          label: actionLabel("mapAll", locale),
          href: "/map",
        });
      }

      actions.push({
        type: "open_audio",
        label: actionLabel("audio", locale),
        href: "/audio",
      });

      return {
        places: placeList,
        routePlan,
        actions: dedupeActions(actions),
      };
    },
  };
}

function actionLabel(
  key: "map" | "hotels" | "route" | "mapAll" | "audio",
  locale: Locale
): string {
  const labels: Record<typeof key, Record<Locale, string>> = {
    map: { kk: "Картада көрсету", ru: "Показать на карте", en: "Show on Map" },
    hotels: { kk: "Қонақүйлер", ru: "Отели", en: "View Hotels" },
    route: { kk: "Маршрутты ашу", ru: "Открыть маршрут", en: "Open Route" },
    mapAll: { kk: "Картаны ашу", ru: "Открыть карту", en: "Open Map" },
    audio: { kk: "Аудиогид", ru: "Аудиогид", en: "Audio Guide" },
  };
  return labels[key][locale];
}

function dedupeActions(actions: AiResponseMetadata["actions"]) {
  const seen = new Set<string>();
  return actions.filter((a) => {
    const key = `${a.type}:${a.placeId ?? ""}:${a.routeId ?? ""}:${a.href ?? ""}:${a.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function executeTool(
  name: string,
  args: Record<string, unknown>,
  collector: MetadataCollector,
  locale: Locale
): unknown {
  switch (name) {
    case "search_places": {
      const results = searchPlaces({
        locale,
        query: args.query as string | undefined,
        category: args.category as PlaceCategory | undefined,
        minRating: args.minRating as number | undefined,
        limit: (args.limit as number | undefined) ?? 8,
      });
      for (const p of results) collector.addPlace(p);
      return { count: results.length, places: results };
    }
    case "get_place_details": {
      const details = getPlaceDetails(args.placeId as string, locale);
      if (!details) return { error: "Place not found" };
      collector.addPlace(details);
      return details;
    }
    case "search_routes": {
      const routes = searchRoutes({
        locale,
        preset: args.preset as string | undefined,
        maxDurationHours: args.maxDurationHours as number | undefined,
        tags: args.tags as string[] | undefined,
        maxBudgetKzt: args.maxBudgetKzt as number | undefined,
      });
      return { count: routes.length, routes };
    }
    case "get_route_details": {
      const details = getRouteDetails(args.routeId as string, locale);
      if (!details) return { error: "Route not found" };
      collector.setRouteId(details.id);
      for (const stop of details.stops) {
        const ref = placeToRef(stop.placeId, locale);
        if (ref) collector.addPlace(ref);
      }
      return details;
    }
    case "search_bookings": {
      return searchBookings({
        locale,
        type: args.type as "hotel" | "excursion" | "guide" | undefined,
        maxPrice: args.maxPrice as number | undefined,
        minRating: args.minRating as number | undefined,
        limit: (args.limit as number | undefined) ?? 6,
      });
    }
    case "get_official_info": {
      return getOfficialInfo((args.topic as string) ?? "general", locale);
    }
    case "create_custom_route": {
      const plan = buildCustomRoutePlan({
        locale,
        name: args.name as string,
        stopIds: args.stopIds as string[],
        durationHours: args.durationHours as number,
        budgetKzt: args.budgetKzt as number | undefined,
        transport: args.transport as string,
        explanation: args.explanation as string,
      });
      if ("error" in plan) return plan;
      collector.setRoutePlan(plan);
      return plan;
    }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
