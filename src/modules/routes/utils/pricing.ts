import type { Route, RouteBookingInput, RoutePricing } from "../types";

export type PriceBreakdownLine = {
  labelKey: string;
  labelParams?: Record<string, string | number>;
  amountKzt: number;
};

export function calculateRoutePrice(
  route: Route,
  input: Pick<
    RouteBookingInput,
    | "travelers"
    | "includeGuide"
    | "includeHotel"
    | "includeMeals"
    | "includeExcursion"
  >,
  options?: { isStudent?: boolean; isEarlyBooking?: boolean; isFamily?: boolean }
): { total: number; lines: PriceBreakdownLine[] } {
  const p = route.pricing;
  const lines: PriceBreakdownLine[] = [];

  lines.push({ labelKey: "routes.price.base", amountKzt: p.basePriceKzt });

  const perPerson = p.perPersonKzt * input.travelers;
  if (perPerson > 0) {
    lines.push({
      labelKey: "routes.price.travelers",
      labelParams: { count: input.travelers },
      amountKzt: perPerson,
    });
  }

  if (input.includeGuide && p.guideFeeKzt > 0) {
    lines.push({ labelKey: "routes.price.guide", amountKzt: p.guideFeeKzt });
  }

  if (p.transportFeeKzt > 0) {
    lines.push({ labelKey: "routes.price.transport", amountKzt: p.transportFeeKzt });
  }

  if (input.includeHotel && p.hotelAddonKzt > 0) {
    lines.push({ labelKey: "routes.price.hotel", amountKzt: p.hotelAddonKzt });
  }

  if (input.includeMeals && p.mealAddonKzt > 0) {
    lines.push({ labelKey: "routes.price.meals", amountKzt: p.mealAddonKzt });
  }

  if (input.includeExcursion && p.excursionAddonKzt > 0) {
    lines.push({ labelKey: "routes.price.excursion", amountKzt: p.excursionAddonKzt });
  }

  const subtotal = lines.reduce((s, l) => s + l.amountKzt, 0);

  if (options?.isFamily && p.familyDiscountPercent) {
    const d = Math.round(subtotal * (p.familyDiscountPercent / 100));
    lines.push({
      labelKey: "routes.price.discount.family",
      labelParams: { pct: p.familyDiscountPercent },
      amountKzt: -d,
    });
  }
  if (options?.isStudent && p.studentDiscountPercent) {
    const d = Math.round(subtotal * (p.studentDiscountPercent / 100));
    lines.push({
      labelKey: "routes.price.discount.student",
      labelParams: { pct: p.studentDiscountPercent },
      amountKzt: -d,
    });
  }
  if (options?.isEarlyBooking && p.earlyBookingDiscountPercent) {
    const d = Math.round(subtotal * (p.earlyBookingDiscountPercent / 100));
    lines.push({
      labelKey: "routes.price.discount.early",
      labelParams: { pct: p.earlyBookingDiscountPercent },
      amountKzt: -d,
    });
  }
  if (input.travelers >= 4 && p.groupDiscountPercent) {
    const d = Math.round(subtotal * (p.groupDiscountPercent / 100));
    lines.push({
      labelKey: "routes.price.discount.group",
      labelParams: { pct: p.groupDiscountPercent },
      amountKzt: -d,
    });
  }

  const total = lines.reduce((s, l) => s + l.amountKzt, 0);
  return { total, lines };
}

/** Default estimate: base + one person + typical transport on route */
export function estimateDisplayPrice(route: Route): number {
  const p = route.pricing;
  return p.basePriceKzt + p.perPersonKzt + (p.transportFeeKzt > 0 ? Math.round(p.transportFeeKzt / 2) : 0);
}

export function defaultPricing(overrides?: Partial<RoutePricing>): RoutePricing {
  return {
    basePriceKzt: 8000,
    perPersonKzt: 3500,
    guideFeeKzt: 12000,
    transportFeeKzt: 6000,
    hotelAddonKzt: 18000,
    mealAddonKzt: 4500,
    excursionAddonKzt: 15000,
    premiumAddonKzt: 25000,
    groupDiscountPercent: 10,
    earlyBookingDiscountPercent: 8,
    studentDiscountPercent: 15,
    familyDiscountPercent: 12,
    ...overrides,
  };
}
