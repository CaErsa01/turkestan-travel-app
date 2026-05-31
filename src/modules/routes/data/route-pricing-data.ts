import type { RoutePricing, RouteStop } from "../types";

/**
 * Market-based KZT estimates (2025, Turkestan region):
 * - Yasawi museum ticket ~700 ₸ (kazakhstan.travel, museum tariffs)
 * - Otyrar archaeological site ~1000 ₸
 * - Licensed guide half-day ~15 000–18 000 ₸, full day ~22 000–28 000 ₸
 * - Turkestan ↔ Arystan Bab taxi/minivan ~25 000–30 000 ₸ round trip
 * - Turkestan ↔ Otyrar ~32 000–38 000 ₸ round trip
 * - Yassawi Hotel standard ~28 000–35 000 ₸/night
 * - Set lunch ~3 500–5 500 ₸/person
 */
const ENTRY_KZT: Record<string, number> = {
  yasawi: 0,
  museum: 700,
  hazret: 0,
  bazaar: 0,
  arystan: 0,
  karavan: 0,
  otyrar: 1000,
  "hotel-yassawi": 0,
  "turkestan-airport": 0,
  station: 0,
  "restaurant-dastarkhan": 0,
  "nauryz-fest": 0,
};

const SERVICE_FEE = { self: 2000, guided: 4500, premium: 12000 };

function sumEntryFees(stops: RouteStop[]): number {
  return stops.reduce((s, stop) => s + (ENTRY_KZT[stop.placeId] ?? 0), 0);
}

function hasCarLeg(stops: RouteStop[]): boolean {
  return stops.some((s) => s.transportMode === "car");
}

function carDestinations(stops: RouteStop[]): string[] {
  return stops.filter((s) => s.transportMode === "car").map((s) => s.placeId);
}

function transportFee(stops: RouteStop[]): number {
  const dests = carDestinations(stops);
  if (dests.length === 0) return 0;
  if (dests.includes("otyrar")) return 34000;
  if (dests.includes("arystan")) return 28000;
  return hasCarLeg(stops) ? 15000 : 0;
}

function guideFee(durationHours: number, bookingType: "self-guided" | "guided" | "premium"): number {
  if (bookingType === "self-guided") return 12000;
  if (bookingType === "premium") return 42000;
  if (durationHours <= 6) return 16000;
  if (durationHours <= 12) return 24000;
  return 38000;
}

export type RoutePricingInput = {
  id: string;
  durationHours: number;
  bookingType: "self-guided" | "guided" | "premium";
  stops: RouteStop[];
  preset: string;
};

export function buildRealisticPricing(input: RoutePricingInput): RoutePricing {
  const tickets = sumEntryFees(input.stops);
  const service =
    input.bookingType === "premium"
      ? SERVICE_FEE.premium
      : input.bookingType === "guided"
        ? SERVICE_FEE.guided
        : SERVICE_FEE.self;

  const basePriceKzt = tickets + service;
  const perPersonKzt =
    input.preset === "budget"
      ? 1800
      : input.preset === "premium"
        ? 32000
        : input.durationHours >= 12
          ? 6500
          : 4200;

  const transportFeeKzt = transportFee(input.stops);
  const guideFeeKzt = guideFee(input.durationHours, input.bookingType);

  const hotelAddonKzt =
    input.preset === "2-day" || input.preset === "premium" ? 32000 : 28000;
  const mealAddonKzt = input.preset === "budget" ? 2800 : 4800;
  const excursionAddonKzt = input.stops.some((s) => s.placeId === "otyrar") ? 8500 : 12000;
  const premiumAddonKzt = input.preset === "premium" ? 25000 : 18000;

  return {
    basePriceKzt,
    perPersonKzt,
    guideFeeKzt,
    transportFeeKzt,
    hotelAddonKzt,
    mealAddonKzt,
    excursionAddonKzt,
    premiumAddonKzt,
    groupDiscountPercent: 10,
    earlyBookingDiscountPercent: 8,
    studentDiscountPercent: 15,
    familyDiscountPercent: 12,
  };
}
