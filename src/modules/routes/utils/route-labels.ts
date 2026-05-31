import type { Locale } from "@/domain/types";
import { translate } from "@/lib/i18n/dictionaries";

export function routeTagLabel(locale: Locale, tag: string): string {
  return translate(locale, `routes.tag.${tag}`) || tag;
}

export function routeDifficultyLabel(locale: Locale, d: string): string {
  return translate(locale, `routes.difficulty.${d}`) || d;
}

export function routeTransportLabel(locale: Locale, t: string): string {
  return translate(locale, `routes.transport.${t}`) || t;
}

export function routeBookingTypeLabel(locale: Locale, b: string): string {
  return translate(locale, `routes.bookingType.${b}`) || b;
}

export function routePresetLabel(locale: Locale, p: string): string {
  return translate(locale, `routes.preset.${p}`) || p;
}

export function interpolate(template: string, params: Record<string, string | number>): string {
  return Object.entries(params).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    template
  );
}
