"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/domain/types";

type AppState = {
  locale: Locale;
  isOnline: boolean;
  toast: string | null;
  setLocale: (l: Locale) => void;
  setOnline: (v: boolean) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: "kk",
      isOnline: true,
      toast: null,
      setLocale: (locale) => set({ locale }),
      setOnline: (isOnline) => set({ isOnline }),
      showToast: (toast) => {
        set({ toast });
        setTimeout(() => set({ toast: null }), 3500);
      },
      clearToast: () => set({ toast: null }),
    }),
    { name: "tt-app", partialize: (s) => ({ locale: s.locale }) }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener("online", () => useAppStore.getState().setOnline(true));
  window.addEventListener("offline", () => useAppStore.getState().setOnline(false));
}
