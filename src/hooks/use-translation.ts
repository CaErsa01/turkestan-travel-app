"use client";

import { useAppStore } from "@/stores/use-app-store";
import { translate } from "@/lib/i18n/dictionaries";
import { getLocalized } from "@/domain/data/places";
import { interpolate } from "@/modules/routes/utils/route-labels";
import type { LocalizedString } from "@/domain/types";

export function useTranslation() {
  const locale = useAppStore((s) => s.locale);
  const t = (key: string, params?: Record<string, string | number>) => {
    const raw = translate(locale, key);
    return params ? interpolate(raw, params) : raw;
  };
  const loc = (obj: LocalizedString) => getLocalized(obj, locale);
  return { locale, t, loc };
}
