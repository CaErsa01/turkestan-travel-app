"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";
import { QR_OBJECTS, MAP_PINS } from "@/data/tourism";

export function QrFeature() {
  const { lang, t } = useApp();
  const [obj, setObj] = useState("yasawi");
  const pin = MAP_PINS.find((p) => p.id === obj);
  const meta = QR_OBJECTS.find((q) => q.id === obj);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://turkestan-travel.kz/site/${obj}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-turquoise">
          {t("common.open")} →
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("feat.qr.title")}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          {QR_OBJECTS.map((q) => (
            <Button
              key={q.id}
              size="sm"
              variant={obj === q.id ? "default" : "ghost"}
              onClick={() => setObj(q.id)}
            >
              {MAP_PINS.find((p) => p.id === q.id)?.name[lang].slice(0, 12)}…
            </Button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Image src={qrUrl} alt="QR Code" width={180} height={180} className="rounded-xl" unoptimized />
          <div className="flex-1 text-sm">
            <h4 className="font-bold">{pin?.name[lang]}</h4>
            <p className="mt-2 text-navy/60">
              {lang === "kk" ? "Жұмыс уақыты" : lang === "ru" ? "Часы работы" : "Hours"}: {meta?.hours}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${pin?.lat},${pin?.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-turquoise hover:underline"
            >
              {lang === "kk" ? "Картаға өту" : lang === "ru" ? "На карту" : "Go to map"} →
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
