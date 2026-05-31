"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Route,
  RouteBookingRecord,
  RouteFilters,
  CustomRoutePlan,
  RouteTransportMode,
} from "../types";
import { DEFAULT_ROUTE_FILTERS } from "../utils/filters";

type RoutesModuleState = {
  filters: RouteFilters;
  compareIds: string[];
  favoriteIds: string[];
  recentRouteIds: string[];
  customRoutes: Route[];
  customPlans: CustomRoutePlan[];
  bookings: RouteBookingRecord[];
  plannerStopIds: string[];
  plannerMode: RouteTransportMode;

  setFilters: (partial: Partial<RouteFilters>) => void;
  resetFilters: () => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  toggleFavorite: (id: string) => void;
  addRecent: (id: string) => void;
  addCustomRoute: (route: Route) => void;
  duplicateRoute: (route: Route) => void;
  addBooking: (booking: RouteBookingRecord) => void;
  setPlannerStops: (ids: string[]) => void;
  addPlannerStop: (placeId: string) => void;
  removePlannerStop: (placeId: string) => void;
  reorderPlannerStop: (from: number, to: number) => void;
  setPlannerMode: (mode: RouteTransportMode) => void;
  savePlannerAsCustom: (name: string) => void;
  clearPlanner: () => void;
};

export const useRoutesModuleStore = create<RoutesModuleState>()(
  persist(
    (set, get) => ({
      filters: DEFAULT_ROUTE_FILTERS,
      compareIds: [],
      favoriteIds: [],
      recentRouteIds: [],
      customRoutes: [],
      customPlans: [],
      bookings: [],
      plannerStopIds: [],
      plannerMode: "walking",

      setFilters: (partial) => set({ filters: { ...get().filters, ...partial } }),
      resetFilters: () => set({ filters: DEFAULT_ROUTE_FILTERS }),
      toggleCompare: (id) => {
        const cur = get().compareIds;
        if (cur.includes(id)) set({ compareIds: cur.filter((x) => x !== id) });
        else if (cur.length < 3) set({ compareIds: [...cur, id] });
      },
      clearCompare: () => set({ compareIds: [] }),
      toggleFavorite: (id) => {
        const cur = get().favoriteIds;
        set({
          favoriteIds: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
        });
      },
      addRecent: (id) => {
        const cur = get().recentRouteIds.filter((x) => x !== id);
        set({ recentRouteIds: [id, ...cur].slice(0, 10) });
      },
      addCustomRoute: (route) => set({ customRoutes: [...get().customRoutes, route] }),
      duplicateRoute: (route) => {
        const dup: Route = {
          ...route,
          id: `custom-${Date.now()}`,
          title: {
            kk: `${route.title.kk} (көшірме)`,
            ru: `${route.title.ru} (копия)`,
            en: `${route.title.en} (copy)`,
          },
        };
        set({ customRoutes: [...get().customRoutes, dup] });
      },
      addBooking: (booking) => set({ bookings: [booking, ...get().bookings] }),
      setPlannerStops: (plannerStopIds) => set({ plannerStopIds }),
      addPlannerStop: (placeId) => {
        const cur = get().plannerStopIds;
        if (cur.includes(placeId)) return;
        set({ plannerStopIds: [...cur, placeId] });
      },
      removePlannerStop: (placeId) =>
        set({ plannerStopIds: get().plannerStopIds.filter((id) => id !== placeId) }),
      reorderPlannerStop: (from, to) => {
        const cur = [...get().plannerStopIds];
        const [item] = cur.splice(from, 1);
        cur.splice(to, 0, item);
        set({ plannerStopIds: cur });
      },
      setPlannerMode: (plannerMode) => set({ plannerMode }),
      savePlannerAsCustom: (name) => {
        const ids = get().plannerStopIds;
        if (ids.length === 0) return;
        const plan: CustomRoutePlan = {
          id: `plan-${Date.now()}`,
          name,
          stopIds: ids,
          transportMode: get().plannerMode,
          createdAt: new Date().toISOString(),
        };
        set({ customPlans: [plan, ...get().customPlans] });
      },
      clearPlanner: () => set({ plannerStopIds: [] }),
    }),
    { name: "tt-routes-module" }
  )
);

/** Back-compat alias */
export const useRouteStore = useRoutesModuleStore;
