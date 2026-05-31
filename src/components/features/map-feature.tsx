"use client";

import { useState } from "react";
import { Navigation, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";
import { MAP_PINS } from "@/data/tourism";

export function MapFeature() {
  const { lang, t, activePin, setActivePin, toast } = useApp();
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);

  const requestGeo = () => {
    if (!navigator.geolocation) {
      toast("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast(
          lang === "kk"
            ? "Геолокация алынды!"
            : lang === "ru"
              ? "Геолокация получена!"
              : "Geolocation received!"
        );
      },
      () => toast(lang === "kk" ? "Рұқсат қажет" : "Permission required")
    );
  };

  const navigate = (pinId: string) => {
    const pin = MAP_PINS.find((p) => p.id === pinId);
    if (!pin) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}`,
      "_blank"
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-turquoise">
          {t("common.open")} →
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("feat.map.title")}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video overflow-hidden rounded-xl bg-navy">
          <iframe
            title="Turkestan Map"
            className="h-full w-full opacity-90"
            src="https://www.openstreetmap.org/export/embed.html?bbox=68.24%2C43.28%2C68.32%2C43.33&layer=mapnik&marker=43.297%2C68.272"
          />
          {MAP_PINS.map((pin, i) => (
            <button
              key={pin.id}
              type="button"
              onClick={() => setActivePin(pin.id)}
              className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full border-2 border-white shadow-lg transition ${
                activePin === pin.id ? "bg-turquoise scale-125" : "bg-sand"
              }`}
              style={{ left: `${18 + i * 14}%`, top: `${35 + (i % 3) * 12}%` }}
            >
              <MapPin className="h-4 w-4 text-navy" />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={requestGeo}>
            <Navigation className="h-4 w-4" />
            Geolocation
          </Button>
          {activePin && (
            <Button size="sm" variant="secondary" onClick={() => navigate(activePin)}>
              Navigate
            </Button>
          )}
        </div>
        <ul className="max-h-40 space-y-2 overflow-y-auto">
          {MAP_PINS.map((pin) => (
            <li key={pin.id}>
              <button
                type="button"
                onClick={() => setActivePin(pin.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  activePin === pin.id
                    ? "bg-turquoise/15 font-semibold text-turquoise"
                    : "hover:bg-navy/5"
                }`}
              >
                {pin.name[lang]}
              </button>
            </li>
          ))}
        </ul>
        {geo && (
          <p className="text-xs text-navy/50">
            Your location: {geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
