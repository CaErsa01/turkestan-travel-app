"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Map,
  Route,
  ExternalLink,
  Headphones,
  QrCode,
  Sparkles,
  Star,
  Smartphone,
  HelpCircle,
  ChevronRight,
  Award,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/use-translation";
import { useAppStore } from "@/stores/use-app-store";
import type { Locale } from "@/domain/types";
import { SafeImage } from "@/components/shared/safe-image";
import { HERO_IMAGE, featureImage, placeImageUrl } from "@/lib/images";
import { FeaturePanel, type FeatureId } from "./feature-panels";
import { cn } from "@/lib/utils";
import { PLACES } from "@/domain/data/places";

type NavItem = {
  id: FeatureId;
  icon: typeof Map;
  labelKey: string;
  descKey: string;
  size: "xl" | "md" | "sm";
};

const NAV: NavItem[] = [
  { id: "map", icon: Map, labelKey: "nav.map", descKey: "feat.map.desc", size: "xl" },
  { id: "routes", icon: Route, labelKey: "nav.routes", descKey: "feat.routes.desc", size: "xl" },
  { id: "booking", icon: ExternalLink, labelKey: "nav.booking", descKey: "feat.booking.desc", size: "xl" },
  { id: "audio", icon: Headphones, labelKey: "nav.audio", descKey: "feat.audio.desc", size: "md" },
  { id: "qr", icon: QrCode, labelKey: "nav.qr", descKey: "feat.qr.desc", size: "md" },
  { id: "ai", icon: Sparkles, labelKey: "nav.ai", descKey: "feat.ai.desc", size: "md" },
  { id: "reviews", icon: Star, labelKey: "nav.reviews", descKey: "feat.reviews.desc", size: "md" },
  { id: "mobile", icon: Smartphone, labelKey: "nav.mobile", descKey: "feat.mobile.desc", size: "sm" },
  { id: "help", icon: HelpCircle, labelKey: "nav.help", descKey: "feat.help.desc", size: "sm" },
];

const STATS = [
  { icon: Award, key: "stats.unesco" },
  { icon: Users, key: "stats.visitors" },
];

export function CompactHome() {
  const { t, loc } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const [open, setOpen] = useState<FeatureId | null>(null);

  const primary = NAV.filter((n) => n.size === "xl");
  const secondary = NAV.filter((n) => n.size === "md");
  const tertiary = NAV.filter((n) => n.size === "sm");
  const titleKey = open ? NAV.find((n) => n.id === open)?.labelKey ?? "" : "";

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-[#FAF8F5] bg-mesh-gradient">
      {/* Premium header — single nav row */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <span className="font-display text-xl font-bold tracking-tight text-charcoal md:text-2xl">
            Turkistan<span className="text-heritage">Travel</span>
          </span>
          <nav className="hidden flex-1 justify-center gap-1 lg:flex" aria-label="Main">
            {NAV.map(({ id, labelKey }) => (
              <button
                key={id}
                type="button"
                onClick={() => setOpen(id)}
                className={cn(
                  "nav-pill",
                  open === id ? "nav-pill-active" : "nav-pill-idle"
                )}
              >
                {t(labelKey)}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {(["kk", "ru", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide transition",
                  locale === l
                    ? "bg-charcoal text-white"
                    : "bg-charcoal/5 text-charcoal/50 hover:bg-charcoal/10"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        {/* Mobile nav scroll */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden scrollbar-none">
          {NAV.map(({ id, labelKey }) => (
            <button
              key={id}
              type="button"
              onClick={() => setOpen(id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
                open === id ? "bg-heritage text-white" : "bg-white text-charcoal/70 shadow-sm"
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-6 md:px-6">
        {/* Cinematic hero — Airbnb / luxury DMO style */}
        <section className="relative mt-4 overflow-hidden rounded-3xl shadow-luxury md:mt-6">
          <div className="relative min-h-[280px] md:min-h-[340px]">
            <SafeImage
              src={HERO_IMAGE}
              alt="Turkistan"
              fill
              priority
              className="object-cover"
            />
            <div className="hero-gradient absolute inset-0" />
            <div className="relative flex h-full min-h-[280px] flex-col justify-end p-6 md:min-h-[340px] md:p-10">
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
                  UNESCO · Kazakhstan
                </p>
                <h1 className="font-display text-4xl font-bold text-white md:text-6xl lg:text-7xl">
                  {t("hero.title")}
                </h1>
                <p className="mt-2 max-w-xl text-sm font-medium text-white/90 md:text-lg">
                  {t("hero.subtitle")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {STATS.map(({ icon: Icon, key }) => (
                    <span key={key} className="stat-pill flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      {t(key)}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Primary features — large image cards */}
        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-xl font-bold text-charcoal md:text-2xl">
              {t("section.explore")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {primary.map((item, i) => (
              <FeatureTile
                key={item.id}
                item={item}
                t={t}
                onOpen={() => setOpen(item.id)}
                delay={i * 0.05}
                tall
              />
            ))}
          </div>
        </section>

        {/* Secondary row */}
        <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {secondary.map((item, i) => (
            <FeatureTile
              key={item.id}
              item={item}
              t={t}
              onOpen={() => setOpen(item.id)}
              delay={i * 0.05}
            />
          ))}
        </section>

        {/* Tertiary + destinations */}
        <section className="mt-4 grid gap-4 md:grid-cols-[1fr_2fr]">
          <div className="grid grid-cols-3 gap-2">
            {tertiary.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setOpen(item.id)}
                className="feature-card flex flex-col items-center justify-center gap-2 rounded-xl bg-white p-4 text-center ring-1 ring-black/5"
              >
                <item.icon className="h-6 w-6 text-heritage" />
                <span className="text-[11px] font-semibold text-charcoal">{t(item.labelKey)}</span>
              </button>
            ))}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-charcoal/50">
              {t("section.destinations")}
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {PLACES.filter((p) =>
                ["yasawi", "hazret", "arystan", "otyrar", "karavan"].includes(p.id)
              ).map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => setOpen("map")}
                  className="destination-card group text-left"
                >
                  <div className="relative h-36 w-[200px]">
                    <SafeImage
                      src={placeImageUrl(place.id)}
                      alt={loc(place.name)}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="feature-card-overlay absolute inset-0" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-bold text-white">{loc(place.name)}</p>
                      <p className="flex items-center gap-1 text-xs text-white/80">
                        {t("common.open")}
                        <ChevronRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Premium footer */}
      <footer className="bg-charcoal py-8 text-center">
        <p className="px-4 text-sm font-medium tracking-wide text-white/90 md:text-base">
          {t("footer.slogan")}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-6 text-xs text-white/50">
          <span>{t("footer.hospitable")}</span>
          <span>·</span>
          <span>{t("footer.safe")}</span>
          <span>·</span>
          <span>{t("footer.green")}</span>
        </div>
      </footer>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent
          className={cn(
            "z-[200] max-h-[90vh] overflow-hidden rounded-2xl border-0 bg-[#FAF8F5] p-0 shadow-luxury",
            open === "map" && "w-[min(96vw,920px)] max-w-none"
          )}
        >
          <div className="border-b border-charcoal/10 px-6 py-4">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {titleKey ? t(titleKey) : ""}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 pb-6">
            {open && <FeaturePanel id={open} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FeatureTile({
  item,
  t,
  onOpen,
  delay,
  tall,
}: {
  item: NavItem;
  t: (k: string) => string;
  onOpen: () => void;
  delay: number;
  tall?: boolean;
}) {
  const Icon = item.icon;
  return (
    <motion.button
      type="button"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onOpen}
      className={cn(
        "feature-card group relative w-full text-left",
        tall ? "min-h-[200px] md:min-h-[240px]" : "min-h-[140px]"
      )}
    >
      <div className={cn("relative w-full", tall ? "h-full min-h-[200px] md:min-h-[240px]" : "min-h-[140px]")}>
        <SafeImage
          src={featureImage(item.id)}
          alt={t(item.labelKey)}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="feature-card-overlay absolute inset-0" />
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
          </div>
          <p className="font-display text-lg font-bold text-white md:text-xl">{t(item.labelKey)}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-white/75">{t(item.descKey)}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold-light">
            {t("common.open")}
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
