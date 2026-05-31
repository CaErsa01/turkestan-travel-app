"use client";

import { useTranslation } from "@/hooks/use-translation";
import { calculateRoutePrice } from "../utils/pricing";
import type { Route, RouteBookingInput } from "../types";

type Props = {
  route: Route;
  input: Pick<
    RouteBookingInput,
    "travelers" | "includeGuide" | "includeHotel" | "includeMeals" | "includeExcursion"
  >;
  options?: { isStudent?: boolean; isEarlyBooking?: boolean; isFamily?: boolean };
};

export function RoutePriceBox({ route, input, options }: Props) {
  const { t } = useTranslation();
  const { total, lines } = calculateRoutePrice(route, input, options);

  return (
    <div className="panel-light p-4">
      <h3 className="font-semibold">{t("routes.price.title")}</h3>
      <ul className="mt-3 space-y-1.5 text-sm">
        {lines.map((line, i) => (
          <li key={i} className="flex justify-between gap-2">
            <span className="text-charcoal/70">{t(line.labelKey, line.labelParams)}</span>
            <span className={line.amountKzt < 0 ? "text-green-600" : ""}>
              {line.amountKzt < 0 ? "−" : ""}
              {Math.abs(line.amountKzt).toLocaleString()} ₸
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between border-t border-charcoal/10 pt-3 font-bold">
        <span>{t("routes.price.total")}</span>
        <span className="text-heritage">{total.toLocaleString()} ₸</span>
      </div>
    </div>
  );
}
