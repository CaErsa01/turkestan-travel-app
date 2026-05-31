"use client";

import Link from "next/link";
import {
  X,
  Star,
  Navigation,
  Heart,
  Share2,
  Copy,
  QrCode,
  Plus,
  ExternalLink,
} from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { placeImageUrl } from "@/lib/images";
import { useTranslation } from "@/hooks/use-translation";
import { useMapModuleStore } from "../store/use-map-module-store";
import { useAppStore } from "@/stores/use-app-store";
import { formatDistance } from "../utils/geo";
import { mapsDirectionsUrl } from "@/lib/utils/geo";
import { TURKESTAN_BOOKING_SEARCH } from "@/lib/external-links";
import { toLatLng, hasQrCode } from "@/domain/place-utils";
import type { PlaceMapSummary } from "../types";

type Props = {
  place: PlaceMapSummary | null;
  onClose: () => void;
};

export function PlaceDetailsDrawer({ place, onClose }: Props) {
  const { loc, locale } = useTranslation();
  const showToast = useAppStore.getState().showToast;
  const savedPlaceIds = useMapModuleStore((s) => s.savedPlaceIds);
  const toggleSavedPlace = useMapModuleStore((s) => s.toggleSavedPlace);
  const addRouteStop = useMapModuleStore((s) => s.addRouteStop);
  const setShowDirections = useMapModuleStore((s) => s.setShowDirections);
  const setShowRouteBuilder = useMapModuleStore((s) => s.setShowRouteBuilder);

  if (!place) return null;

  const saved = savedPlaceIds.includes(place.id);
  const inRoute = useMapModuleStore.getState().routeStopIds.includes(place.id);

  const copyLocation = () => {
    const { lat, lng } = toLatLng(place);
    navigator.clipboard?.writeText(`${lat}, ${lng}`);
    showToast("Coordinates copied");
  };

  const sharePlace = async () => {
    const url = `${window.location.origin}/map?place=${place.id}`;
    if (navigator.share) {
      await navigator.share({ title: loc(place.name), url });
    } else {
      navigator.clipboard?.writeText(url);
      showToast("Link copied");
    }
  };

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-[1000] max-h-[55vh] overflow-hidden rounded-t-2xl bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.15)] md:inset-x-auto md:right-4 md:top-4 md:bottom-4 md:left-auto md:max-h-none md:w-[360px] md:rounded-2xl"
      role="dialog"
      aria-label="Place details"
    >
      <div className="relative h-36 w-full shrink-0 md:h-40">
        <SafeImage src={placeImageUrl(place.id)} alt="" fill className="object-cover" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-y-auto p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-heritage">
          {place.category}
        </p>
        <h2 className="font-display text-xl font-bold text-charcoal">{loc(place.name)}</h2>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-charcoal/60">
          <span className="flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {place.rating}
          </span>
          {place.distanceKm !== null && (
            <span>{formatDistance(place.distanceKm, locale)} away</span>
          )}
          <span>{loc(place.openingHours)}</span>
        </div>
        <p className="mt-2 line-clamp-3 text-sm text-charcoal/80">{loc(place.description)}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="btn-secondary flex items-center justify-center gap-1 text-xs"
            onClick={() => {
              addRouteStop(place.id);
              setShowRouteBuilder(true);
              setShowDirections(true);
              showToast("Added to route");
            }}
            disabled={inRoute}
          >
            <Plus className="h-3.5 w-3.5" />
            {inRoute ? "In route" : "Add route"}
          </button>
          <a
            href={mapsDirectionsUrl(place.latitude, place.longitude, loc(place.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center justify-center gap-1 text-xs"
          >
            <Navigation className="h-3.5 w-3.5" /> Navigate
          </a>
          <button
            type="button"
            className="btn-secondary flex items-center justify-center gap-1 text-xs"
            onClick={() => toggleSavedPlace(place.id)}
          >
            <Heart className={`h-3.5 w-3.5 ${saved ? "fill-red-500 text-red-500" : ""}`} />
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            className="btn-secondary flex items-center justify-center gap-1 text-xs"
            onClick={sharePlace}
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <button
            type="button"
            className="btn-secondary flex items-center justify-center gap-1 text-xs"
            onClick={copyLocation}
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
          {hasQrCode(place) && (
            <Link
              href={`/qr/${place.id}`}
              className="btn-secondary flex items-center justify-center gap-1 text-xs"
            >
              <QrCode className="h-3.5 w-3.5" /> QR
            </Link>
          )}
          <a
            href={TURKESTAN_BOOKING_SEARCH}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary col-span-2 flex items-center justify-center gap-1 text-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Book nearby (Booking.com)
          </a>
        </div>
      </div>
    </div>
  );
}
