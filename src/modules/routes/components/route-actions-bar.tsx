"use client";

import Link from "next/link";
import {
  Bookmark,
  Copy,
  Download,
  GitCompare,
  Heart,
  Map,
  Navigation,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/use-app-store";
import { useUserStore } from "@/stores/use-user-store";
import { useMapModuleStore } from "@/modules/map/store/use-map-module-store";
import { useRoutesModuleStore } from "../store/use-routes-module-store";
import { getRouteStopIds } from "../data/tour-routes";
import { useTranslation } from "@/hooks/use-translation";
import { getPlaceById } from "@/domain/data/places";
import type { Route } from "../types";

type Props = {
  route: Route;
  onBook?: () => void;
  onCompare?: () => void;
  compact?: boolean;
};

export function RouteActionsBar({ route, onBook, onCompare, compact }: Props) {
  const { t, loc } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);
  const toggleSavedRoute = useUserStore((s) => s.toggleSavedRoute);
  const savedRouteIds = useUserStore((s) => s.savedRouteIds);
  const toggleFavorite = useRoutesModuleStore((s) => s.toggleFavorite);
  const favoriteIds = useRoutesModuleStore((s) => s.favoriteIds);
  const toggleCompare = useRoutesModuleStore((s) => s.toggleCompare);
  const compareIds = useRoutesModuleStore((s) => s.compareIds);
  const setRouteStopIds = useMapModuleStore((s) => s.setRouteStopIds);
  const setRouteMode = useMapModuleStore((s) => s.setRouteMode);

  const isSaved = savedRouteIds.includes(route.id);
  const isFavorite = favoriteIds.includes(route.id);
  const isCompare = compareIds.includes(route.id);

  const loadOnMap = () => {
    setRouteStopIds(getRouteStopIds(route));
    setRouteMode(route.transportType === "walking" ? "walking" : "driving");
    showToast(t("routes.toast.mapLoaded"));
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/routes/${route.id}`;
    await navigator.clipboard.writeText(url);
    showToast(t("routes.toast.linkCopied"));
  };

  const shareRoute = async () => {
    const url = `${window.location.origin}/routes/${route.id}`;
    if (navigator.share) {
      await navigator.share({ title: loc(route.title), url });
    } else {
      await copyLink();
    }
  };

  const downloadItinerary = () => {
    const text = route.stops
      .sort((a, b) => a.order - b.order)
      .map((s) => {
        const place = getPlaceById(s.placeId);
        return `${s.order}. ${place ? loc(place.name) : s.placeId} (${s.durationMin} min)`;
      })
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${route.id}-itinerary.txt`;
    a.click();
    showToast(t("routes.toast.itineraryDownloaded"));
  };

  const startNavigation = () => {
    loadOnMap();
    window.open(`/map?route=${route.id}`, "_blank");
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={onBook}>{t("routes.action.book")}</Button>
        <Button size="sm" variant="secondary" asChild>
          <Link href={`/map?route=${route.id}`}>{t("nav.map")}</Link>
        </Button>
        <Button size="sm" variant="secondary" onClick={() => toggleSavedRoute(route.id)}>
          {isSaved ? t("routes.action.saved") : t("routes.action.save")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={onBook}>{t("routes.action.bookNow")}</Button>
      <Button size="sm" variant="secondary" onClick={loadOnMap}>
        <Map className="h-4 w-4" /> {t("routes.action.viewMap")}
      </Button>
      <Button size="sm" variant="secondary" onClick={startNavigation}>
        <Navigation className="h-4 w-4" /> {t("routes.action.navigate")}
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          toggleSavedRoute(route.id);
          showToast(isSaved ? t("routes.toast.removedProfile") : t("routes.toast.savedProfile"));
        }}
      >
        <Bookmark className="h-4 w-4" /> {isSaved ? t("routes.action.saved") : t("routes.action.save")}
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toggleFavorite(route.id)}>
        <Heart className={`h-4 w-4 ${isFavorite ? "fill-heritage text-heritage" : ""}`} />
        {t("routes.action.favorite")}
      </Button>
      <Button size="sm" variant="secondary" onClick={shareRoute}>
        <Share2 className="h-4 w-4" /> {t("routes.action.share")}
      </Button>
      <Button size="sm" variant="secondary" onClick={copyLink}>
        <Copy className="h-4 w-4" /> {t("routes.action.copyLink")}
      </Button>
      <Button size="sm" variant="secondary" onClick={downloadItinerary}>
        <Download className="h-4 w-4" /> {t("routes.action.itinerary")}
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          toggleCompare(route.id);
          onCompare?.();
        }}
      >
        <GitCompare className="h-4 w-4" />{" "}
        {isCompare ? t("routes.action.inCompare") : t("routes.action.compare")}
      </Button>
      <Button size="sm" variant="secondary" asChild>
        <Link href="/booking">{t("routes.action.hotels")}</Link>
      </Button>
    </div>
  );
}
