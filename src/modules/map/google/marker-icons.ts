import type { PlaceCategory } from "@/domain/types";
import { CATEGORY_TO_LAYER, MARKER_COLORS } from "../constants";
import type { MapLayerId } from "../types";

export function getMarkerColor(category: PlaceCategory): string {
  const layer = CATEGORY_TO_LAYER[category] as MapLayerId;
  return MARKER_COLORS[layer] ?? "#0D7377";
}

/** SVG pin — client-only, pass google.maps namespace after load */
export function buildMarkerIcon(
  maps: typeof google.maps,
  color: string,
  selected = false
): google.maps.Icon {
  const size = selected ? 36 : 28;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><path fill="${color}" stroke="#fff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle fill="#fff" cx="12" cy="9" r="2.5"/></svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new maps.Size(size, size),
    anchor: new maps.Point(size / 2, size),
  };
}

export function buildUserIcon(maps: typeof google.maps): google.maps.Symbol {
  return {
    path: maps.SymbolPath.CIRCLE,
    scale: 10,
    fillColor: "#2563EB",
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: 3,
  };
}
