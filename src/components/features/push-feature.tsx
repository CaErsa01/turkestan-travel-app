"use client";

import { Bell, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";
import { OFFERS, EVENTS } from "@/data/tourism";

export function PushFeature() {
  const { lang, t, pushEnabled, setPushEnabled, notifications } = useApp();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-sand-dark">
          {t("common.open")} →
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("feat.push.title")}</DialogTitle>
        </DialogHeader>
        <Button
          variant={pushEnabled ? "secondary" : "default"}
          className="w-full gap-2"
          onClick={() => setPushEnabled(!pushEnabled)}
        >
          <Bell className="h-4 w-4" />
          {pushEnabled
            ? lang === "kk"
              ? "Push қосулы"
              : lang === "ru"
                ? "Push включён"
                : "Push enabled"
            : lang === "kk"
              ? "Push қосу"
              : lang === "ru"
                ? "Включить Push"
                : "Enable Push"}
        </Button>
        {pushEnabled && (
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="flex items-start gap-3 rounded-xl border border-sand/30 bg-sand/10 p-3 text-sm"
              >
                {n.type === "offer" ? (
                  <Percent className="h-5 w-5 shrink-0 text-sand-dark" />
                ) : (
                  <Bell className="h-5 w-5 shrink-0 text-turquoise" />
                )}
                <div>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-navy/60">{n.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <h4 className="text-sm font-bold text-navy/70">
          {lang === "kk" ? "Акциялар" : lang === "ru" ? "Акции" : "Offers"}
        </h4>
        {OFFERS.map((o) => (
          <div
            key={o.id}
            className="rounded-xl border border-sand/40 bg-gradient-to-r from-sand/20 to-transparent p-3 text-sm"
          >
            <span className="font-bold text-sand-dark">-{o.discount}%</span> {o.title[lang]}
          </div>
        ))}
        <h4 className="text-sm font-bold text-navy/70">
          {lang === "kk" ? "Іс-шаралар" : lang === "ru" ? "События" : "Events"}
        </h4>
        {EVENTS.map((e) => (
          <p key={e.id} className="text-sm text-navy/60">
            {e.date} — {e.title[lang]}
          </p>
        ))}
      </DialogContent>
    </Dialog>
  );
}
