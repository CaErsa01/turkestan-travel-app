"use client";

import { useAppStore } from "@/stores/use-app-store";

export function GlobalToast() {
  const toast = useAppStore((s) => s.toast);
  if (!toast) return null;
  return (
    <div
      role="status"
      className="fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 rounded-lg bg-charcoal px-4 py-2 text-sm text-cream shadow-panel md:bottom-8"
    >
      {toast}
    </div>
  );
}
