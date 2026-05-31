"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/app-context";
import { ROUTES, MAP_PINS } from "@/data/tourism";

export function RoutesFeature() {
  const { lang, t, selectedRoute, setSelectedRoute, toast } = useApp();

  const selectRoute = (id: string) => {
    setSelectedRoute(id);
    localStorage.setItem("tt-route", id);
    toast(
      lang === "kk"
        ? "Маршрут таңдалды!"
        : lang === "ru"
          ? "Маршрут выбран!"
          : "Route selected!"
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
          <DialogTitle>{t("feat.routes.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {ROUTES.map((route) => (
            <div
              key={route.id}
              className={`rounded-xl border p-4 transition ${
                selectedRoute === route.id
                  ? "border-turquoise bg-turquoise/5"
                  : "border-navy/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{route.title[lang]}</h4>
                <Badge variant={route.type === "sacred" ? "default" : "sand"}>
                  {route.duration[lang]}
                </Badge>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-navy/60">
                {route.stops.map((stopId) => {
                  const pin = MAP_PINS.find((p) => p.id === stopId);
                  return pin ? <li key={stopId}>• {pin.name[lang]}</li> : null;
                })}
              </ul>
              <Button
                size="sm"
                className="mt-3"
                variant={selectedRoute === route.id ? "secondary" : "default"}
                onClick={() => selectRoute(route.id)}
              >
                {selectedRoute === route.id ? "✓" : ""}{" "}
                {lang === "kk" ? "Таңдау" : lang === "ru" ? "Выбрать" : "Select"}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
