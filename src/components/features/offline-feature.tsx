"use client";

import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";

const OFFLINE_ITEMS = ["maps", "routes", "contacts", "info"] as const;

export function OfflineFeature() {
  const { lang, t, offlineReady, syncOffline, toast } = useApp();

  const labels: Record<string, Record<typeof lang, string>> = {
    maps: { kk: "Офлайн карта", ru: "Офлайн карта", en: "Offline maps" },
    routes: { kk: "Маршруттар", ru: "Маршруты", en: "Routes" },
    contacts: { kk: "Байланыс нөмірлері", ru: "Контакты", en: "Contacts" },
    info: { kk: "Маңызды ақпарат", ru: "Важная информация", en: "Important info" },
  };

  const download = () => {
    syncOffline();
    toast(
      lang === "kk"
        ? "Деректер офлайн режимге сақталды!"
        : lang === "ru"
          ? "Данные сохранены для офлайн!"
          : "Data saved for offline mode!"
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-turquoise">
          {t("common.open")} →
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("feat.offline.title")}</DialogTitle>
        </DialogHeader>
        <ul className="space-y-3">
          {OFFLINE_ITEMS.map((item) => (
            <li
              key={item}
              className="flex items-center justify-between rounded-xl border border-navy/10 px-4 py-3"
            >
              <span className="text-sm">{labels[item][lang]}</span>
              {offlineReady ? (
                <Check className="h-5 w-5 text-turquoise" />
              ) : (
                <span className="text-xs text-navy/40">—</span>
              )}
            </li>
          ))}
        </ul>
        <Button onClick={download} className="w-full gap-2" disabled={offlineReady}>
          <Download className="h-4 w-4" />
          {offlineReady
            ? lang === "kk"
              ? "Сақталды ✓"
              : lang === "ru"
                ? "Сохранено ✓"
                : "Saved ✓"
            : lang === "kk"
              ? "Жүктеп алу"
              : lang === "ru"
                ? "Скачать"
                : "Download"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
