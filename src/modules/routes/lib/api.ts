import { apiCall } from "@/lib/api/client";
import { TOUR_ROUTES, getTourRouteById } from "../data/tour-routes";
import type { Route } from "../types";

export async function fetchTourRoutes(): Promise<Route[]> {
  return apiCall(() => [...TOUR_ROUTES]);
}

export async function fetchTourRoute(id: string): Promise<Route> {
  return apiCall(() => {
    const route = getTourRouteById(id);
    if (!route) throw { code: "NOT_FOUND", message: "Route not found" };
    return route;
  });
}

export async function submitRouteBooking(payload: {
  routeId: string;
  totalPriceKzt: number;
  breakdown: { labelKey: string; labelParams?: Record<string, string | number>; amountKzt: number }[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  date: string;
  travelers: number;
}) {
  return apiCall(() => ({
    id: `booking-${Date.now()}`,
    ...payload,
    status: "confirmed" as const,
    createdAt: new Date().toISOString(),
  }));
}
