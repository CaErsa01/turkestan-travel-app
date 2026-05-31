"use client";

import { useRouter } from "next/navigation";
import { MapPin, Route, Hotel, Headphones, Compass } from "lucide-react";
import { useMapModuleStore } from "@/modules/map/store/use-map-module-store";
import { getRouteStopIds, getTourRouteById } from "@/modules/routes/data/tour-routes";
import type { AiSuggestedAction } from "../types";

type Props = {
  actions: AiSuggestedAction[];
};

function actionIcon(type: AiSuggestedAction["type"]) {
  switch (type) {
    case "load_route_on_map":
    case "open_map":
    case "open_place":
      return MapPin;
    case "open_route":
      return Route;
    case "view_hotels":
    case "book_excursion":
      return Hotel;
    case "open_audio":
      return Headphones;
    default:
      return Compass;
  }
}

export function AiSuggestedActions({ actions }: Props) {
  const router = useRouter();
  const setRouteStopIds = useMapModuleStore((s) => s.setRouteStopIds);
  const setSelectedPlace = useMapModuleStore((s) => s.setSelectedPlace);

  if (!actions.length) return null;

  const handle = (action: AiSuggestedAction) => {
    switch (action.type) {
      case "open_place":
        if (action.placeId) {
          setSelectedPlace(action.placeId);
          router.push(`/map?place=${action.placeId}`);
        }
        break;
      case "open_route":
        if (action.routeId) router.push(`/routes/${action.routeId}`);
        break;
      case "load_route_on_map": {
        if (action.stopIds?.length) {
          setRouteStopIds(action.stopIds);
          router.push("/map");
          break;
        }
        if (action.routeId) {
          const route = getTourRouteById(action.routeId);
          if (route) {
            setRouteStopIds(getRouteStopIds(route));
            router.push(`/map?route=${action.routeId}`);
          }
        }
        break;
      }
      case "view_hotels":
      case "book_excursion":
        router.push(action.href ?? "/booking");
        break;
      case "open_audio":
        router.push(action.href ?? "/audio");
        break;
      case "open_map":
        router.push(action.href ?? "/map");
        break;
    }
  };

  const unique = actions.slice(0, 6);

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {unique.map((action, i) => {
        const Icon = actionIcon(action.type);
        return (
          <button
            key={`${action.type}-${action.placeId ?? action.routeId ?? i}`}
            type="button"
            onClick={() => handle(action)}
            className="inline-flex items-center gap-1 rounded-full border border-heritage/25 bg-white px-2.5 py-1 text-[11px] font-medium text-heritage transition hover:bg-heritage/5"
          >
            <Icon className="h-3 w-3 shrink-0" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
