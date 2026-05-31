"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LAYERS, TURKESTAN_DEFAULT_ZOOM } from "../constants";
import type {
  MapFilter,
  MapLayerId,
  MapProviderStatus,
  PlannedRoute,
  RouteMode,
  UserLocation,
  SavedRouteRecord,
  RecentPlaceRecord,
} from "../types";

const defaultFilter: MapFilter = {
  search: "",
  categories: [],
  layers: { ...DEFAULT_LAYERS },
  minRating: 0,
  openNowOnly: false,
  historicalOnly: false,
  nearMeOnly: false,
  maxDistanceKm: 15,
  sortBy: "popularity",
  nearbyCategory: "all",
};

type MapModuleState = {
  selectedPlaceId: string | null;
  userLocation: UserLocation | null;
  geoError: string | null;
  filter: MapFilter;
  routeStopIds: string[];
  routeMode: RouteMode;
  plannedRoute: PlannedRoute | null;
  savedPlaceIds: string[];
  savedRoutes: SavedRouteRecord[];
  recentPlaces: RecentPlaceRecord[];
  providerStatus: MapProviderStatus;
  providerError: string | null;
  isFullscreen: boolean;
  zoom: number;
  showRouteBuilder: boolean;
  showFilters: boolean;
  showDirections: boolean;
  showSaved: boolean;

  setSelectedPlace: (id: string | null) => void;
  setUserLocation: (loc: UserLocation | null) => void;
  setGeoError: (msg: string | null) => void;
  setFilter: (partial: Partial<MapFilter>) => void;
  setSearch: (search: string) => void;
  toggleLayer: (layer: MapLayerId) => void;
  setSortBy: (sortBy: MapFilter["sortBy"]) => void;
  setRouteMode: (mode: RouteMode) => void;
  setRouteStopIds: (ids: string[]) => void;
  addRouteStop: (placeId: string) => void;
  removeRouteStop: (placeId: string) => void;
  reorderRouteStop: (fromIndex: number, toIndex: number) => void;
  clearRoute: () => void;
  setPlannedRoute: (route: PlannedRoute | null) => void;
  saveCurrentRoute: (name?: string) => void;
  toggleSavedPlace: (placeId: string) => void;
  addRecentPlace: (placeId: string) => void;
  setProviderStatus: (status: MapProviderStatus, error?: string | null) => void;
  setFullscreen: (v: boolean) => void;
  setZoom: (z: number) => void;
  setShowRouteBuilder: (v: boolean) => void;
  setShowFilters: (v: boolean) => void;
  setShowDirections: (v: boolean) => void;
  setShowSaved: (v: boolean) => void;
};

export const useMapModuleStore = create<MapModuleState>()(
  persist(
    (set, get) => ({
      selectedPlaceId: null,
      userLocation: null,
      geoError: null,
      filter: defaultFilter,
      routeStopIds: [],
      routeMode: "walking",
      plannedRoute: null,
      savedPlaceIds: [],
      savedRoutes: [],
      recentPlaces: [],
      providerStatus: "loading",
      providerError: null,
      isFullscreen: false,
      zoom: TURKESTAN_DEFAULT_ZOOM,
      showRouteBuilder: false,
      showFilters: true,
      showDirections: false,
      showSaved: false,

      setSelectedPlace: (selectedPlaceId) => {
        set({ selectedPlaceId });
        if (selectedPlaceId) get().addRecentPlace(selectedPlaceId);
      },
      setUserLocation: (userLocation) => set({ userLocation, geoError: null }),
      setGeoError: (geoError) => set({ geoError }),
      setFilter: (partial) => set({ filter: { ...get().filter, ...partial } }),
      setSearch: (search) => set({ filter: { ...get().filter, search } }),
      toggleLayer: (layer) => {
        const layers = { ...get().filter.layers, [layer]: !get().filter.layers[layer] };
        set({ filter: { ...get().filter, layers } });
      },
      setSortBy: (sortBy) => set({ filter: { ...get().filter, sortBy } }),
      setRouteMode: (routeMode) => set({ routeMode }),
      setRouteStopIds: (routeStopIds) => set({ routeStopIds, showRouteBuilder: true }),
      addRouteStop: (placeId) => {
        const cur = get().routeStopIds;
        if (cur.includes(placeId)) return;
        set({ routeStopIds: [...cur, placeId], showRouteBuilder: true, showDirections: true });
      },
      removeRouteStop: (placeId) => {
        set({ routeStopIds: get().routeStopIds.filter((id) => id !== placeId) });
      },
      reorderRouteStop: (fromIndex, toIndex) => {
        const ids = [...get().routeStopIds];
        const [moved] = ids.splice(fromIndex, 1);
        ids.splice(toIndex, 0, moved);
        set({ routeStopIds: ids });
      },
      clearRoute: () => set({ routeStopIds: [], plannedRoute: null }),
      setPlannedRoute: (plannedRoute) => set({ plannedRoute }),
      saveCurrentRoute: (name) => {
        const { plannedRoute, routeStopIds, routeMode } = get();
        if (!plannedRoute || routeStopIds.length === 0) return;
        const record: SavedRouteRecord = {
          id: `sr-${Date.now()}`,
          name: name ?? `Route ${new Date().toLocaleDateString()}`,
          stopIds: [...routeStopIds],
          mode: routeMode,
          distanceKm: plannedRoute.distanceKm,
          durationMin: plannedRoute.durationMin,
          savedAt: new Date().toISOString(),
        };
        set({ savedRoutes: [record, ...get().savedRoutes].slice(0, 20) });
      },
      toggleSavedPlace: (placeId) => {
        const cur = get().savedPlaceIds;
        set({
          savedPlaceIds: cur.includes(placeId)
            ? cur.filter((id) => id !== placeId)
            : [...cur, placeId],
        });
      },
      addRecentPlace: (placeId) => {
        const recent = [
          { placeId, viewedAt: new Date().toISOString() },
          ...get().recentPlaces.filter((r) => r.placeId !== placeId),
        ].slice(0, 15);
        set({ recentPlaces: recent });
      },
      setProviderStatus: (providerStatus, providerError = null) =>
        set({ providerStatus, providerError }),
      setFullscreen: (isFullscreen) => set({ isFullscreen }),
      setZoom: (zoom) => set({ zoom }),
      setShowRouteBuilder: (showRouteBuilder) => set({ showRouteBuilder }),
      setShowFilters: (showFilters) => set({ showFilters }),
      setShowDirections: (showDirections) => set({ showDirections }),
      setShowSaved: (showSaved) => set({ showSaved }),
    }),
    {
      name: "tt-map-module",
      partialize: (s) => ({
        filter: { ...s.filter, search: "" },
        savedPlaceIds: s.savedPlaceIds,
        savedRoutes: s.savedRoutes,
        recentPlaces: s.recentPlaces,
        routeMode: s.routeMode,
      }),
    }
  )
);

export const useMapStore = useMapModuleStore;
