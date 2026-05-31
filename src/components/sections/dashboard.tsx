"use client";

import { motion } from "framer-motion";
import { CloudSun, Users, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/app-context";
import { MAP_PINS, EVENTS } from "@/data/tourism";
import { AnimatedCounter } from "@/components/animated-counter";

export function Dashboard() {
  const { lang, t } = useApp();

  const nearby = MAP_PINS.slice(0, 4);

  return (
    <section id="dashboard" className="bg-surface py-24 dark:bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-turquoise">03</span>
          <h2 className="mt-2 font-display text-4xl font-bold text-navy dark:text-surface">
            {t("dashboard.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-navy/60">{t("dashboard.subtitle")}</p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-4">
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-turquoise/15">
                <CloudSun className="h-6 w-6 text-turquoise" />
              </div>
              <div>
                <CardTitle className="text-base">{t("weather.title")}</CardTitle>
                <p className="text-2xl font-bold text-turquoise">{t("weather.temp")}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-navy/60">{t("weather.desc")}</p>
              <p className="mt-2 text-xs text-navy/40">Turkestan, KZ</p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand/30">
                <Users className="h-6 w-6 text-sand-dark" />
              </div>
              <CardTitle className="text-base">
                {lang === "kk" ? "Туристер" : lang === "ru" ? "Туристы" : "Tourists"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-navy dark:text-surface">
                  <AnimatedCounter value={1247} suffix="" />
                </p>
                <p className="text-xs text-navy/50">
                  {lang === "kk" ? "Бүгінгі қонақтар" : lang === "ru" ? "Гостей сегодня" : "Guests today"}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-turquoise">
                  <AnimatedCounter value={4.9} decimals={1} />
                </p>
                <p className="text-xs text-navy/50">{t("stat.rating")}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5 text-turquoise" />
                {t("nearby.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {nearby.map((pin, i) => (
                <div
                  key={pin.id}
                  className="flex items-center justify-between rounded-lg bg-turquoise/5 px-3 py-2 text-sm"
                >
                  <span className="truncate">{pin.name[lang]}</span>
                  <span className="shrink-0 text-xs text-navy/40">
                    {(0.5 + i * 0.3).toFixed(1)} {t("common.km")}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5 text-turquoise" />
                {t("events.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {EVENTS.map((ev) => (
                <div key={ev.id} className="border-l-2 border-turquoise pl-3 text-sm">
                  <p className="text-xs font-bold text-turquoise">{ev.date}</p>
                  <p className="font-medium text-navy dark:text-surface">{ev.title[lang]}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
