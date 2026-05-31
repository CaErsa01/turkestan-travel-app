"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";
import { HOTELS, EXCURSIONS } from "@/data/tourism";

export function BookingFeature() {
  const { lang, t, addBooking, toast } = useApp();
  const [tab, setTab] = useState<"hotel" | "excursion">("hotel");
  const [selected, setSelected] = useState("yassawi");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);

  const hotelNames: Record<string, string> = {
    yassawi: t("hotel.yassawi"),
    plaza: t("hotel.plaza"),
    silk: t("hotel.silk"),
  };
  const excNames: Record<string, string> = {
    classic: t("exc.classic"),
    full: t("exc.full"),
    vip: t("exc.vip"),
  };

  const hotel = HOTELS.find((h) => h.id === selected);
  const exc = EXCURSIONS.find((e) => e.id === selected);
  const price = tab === "hotel" ? (hotel?.price ?? 0) * guests : (exc?.price ?? 0) * guests;

  const book = () => {
    if (!date) {
      toast(lang === "kk" ? "Күнді таңдаңыз" : "Select date");
      return;
    }
    addBooking({
      type: tab,
      itemId: selected,
      name: tab === "hotel" ? hotelNames[selected] : excNames[selected],
      date,
      guests,
      total: price,
    });
    toast(
      lang === "kk"
        ? `Брондалды! ${price.toLocaleString()} ₸`
        : lang === "ru"
          ? `Забронировано! ${price.toLocaleString()} ₸`
          : `Booked! ${price.toLocaleString()} ₸`
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-turquoise">
          {t("common.open")} →
        </Button>
      </DialogTrigger>
      <DialogContent id="booking">
        <DialogHeader>
          <DialogTitle>{t("feat.booking.title")}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          {(["hotel", "excursion"] as const).map((tb) => (
            <Button
              key={tb}
              size="sm"
              variant={tab === tb ? "default" : "ghost"}
              onClick={() => {
                setTab(tb);
                setSelected(tb === "hotel" ? "yassawi" : "classic");
              }}
            >
              {tb === "hotel"
                ? lang === "kk"
                  ? "Қонақ үй"
                  : lang === "ru"
                    ? "Отель"
                    : "Hotel"
                : lang === "kk"
                  ? "Экскурсия"
                  : lang === "ru"
                    ? "Экскурсия"
                    : "Excursion"}
            </Button>
          ))}
        </div>
        <div className="grid gap-2">
          {(tab === "hotel" ? HOTELS : EXCURSIONS).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              className={`rounded-xl border p-3 text-left text-sm ${
                selected === item.id ? "border-turquoise bg-turquoise/5" : ""
              }`}
            >
              {tab === "hotel" ? hotelNames[item.id] : excNames[item.id]} —{" "}
              {"price" in item ? `${item.price.toLocaleString()} ₸` : ""}
            </button>
          ))}
        </div>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input
          type="number"
          min={1}
          max={20}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
        <p className="text-lg font-bold text-turquoise">
          {lang === "kk" ? "Барлығы" : lang === "ru" ? "Итого" : "Total"}: {price.toLocaleString()} ₸
        </p>
        <Button onClick={book}>{t("common.book")}</Button>
      </DialogContent>
    </Dialog>
  );
}
