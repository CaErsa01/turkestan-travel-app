"use client";

import { WifiOff } from "lucide-react";
import { useAppStore } from "@/stores/use-app-store";
import { useTranslation } from "@/hooks/use-translation";

export function OfflineBanner() {
  const isOnline = useAppStore((s) => s.isOnline);
  const { t } = useTranslation();
  if (isOnline) return null;
  return (
    <div className="fixed left-0 right-0 top-0 z-[90] flex items-center justify-center gap-2 bg-amber-600 px-4 py-2 text-sm font-medium text-white">
      <WifiOff className="h-4 w-4" aria-hidden />
      {t("common.offline")} — saved content available
    </div>
  );
}
