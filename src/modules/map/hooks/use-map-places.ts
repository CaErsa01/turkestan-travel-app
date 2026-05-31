"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlaces } from "@/lib/api/places";
import { useMapModuleStore } from "../store/use-map-module-store";
import { filterAndSortPlaces } from "../utils/filter-places";
import { CATEGORY_TO_LAYER } from "../constants";
import type { MapMarker } from "../types";
import { toLatLng } from "@/domain/place-utils";
import { useTranslation } from "@/hooks/use-translation";

export function useMapPlaces() {
  const filter = useMapModuleStore((s) => s.filter);
  const userLocation = useMapModuleStore((s) => s.userLocation);
  const { loc } = useTranslation();

  const { data: places, isLoading, isError, refetch } = useQuery({
    queryKey: ["map-places"],
    queryFn: () => fetchPlaces(),
    staleTime: 120_000,
  });

  const summaries = useMemo(() => {
    if (!places) return [];
    return filterAndSortPlaces(places, filter, userLocation);
  }, [places, filter, userLocation]);

  const markers: MapMarker[] = useMemo(
    () =>
      summaries.map((p) => ({
        id: p.id,
        position: toLatLng(p),
        category: p.category,
        layer: p.layer,
        label: loc(p.name),
      })),
    [summaries, loc]
  );

  return {
    places,
    summaries,
    markers,
    isLoading,
    isError,
    refetch,
  };
}
