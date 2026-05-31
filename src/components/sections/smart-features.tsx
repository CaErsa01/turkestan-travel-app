"use client";

import { motion } from "framer-motion";
import {
  Map,
  Route,
  Hotel,
  QrCode,
  Headphones,
  CloudDownload,
  Star,
  Bell,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { MapFeature } from "@/components/features/map-feature";
import { RoutesFeature } from "@/components/features/routes-feature";
import { BookingFeature } from "@/components/features/booking-feature";
import { QrFeature } from "@/components/features/qr-feature";
import { AudioFeature } from "@/components/features/audio-feature";
import { OfflineFeature } from "@/components/features/offline-feature";
import { ReviewsFeature } from "@/components/features/reviews-feature";
import { PushFeature } from "@/components/features/push-feature";

const FEATURES = [
  { id: "map", icon: Map, keyTitle: "feat.map.title", keyDesc: "feat.map.desc", highlight: false, Component: MapFeature },
  { id: "routes", icon: Route, keyTitle: "feat.routes.title", keyDesc: "feat.routes.desc", highlight: false, Component: RoutesFeature },
  { id: "booking", icon: Hotel, keyTitle: "feat.booking.title", keyDesc: "feat.booking.desc", highlight: false, Component: BookingFeature },
  { id: "qr", icon: QrCode, keyTitle: "feat.qr.title", keyDesc: "feat.qr.desc", highlight: false, Component: QrFeature },
  { id: "audio", icon: Headphones, keyTitle: "feat.audio.title", keyDesc: "feat.audio.desc", highlight: false, Component: AudioFeature },
  { id: "offline", icon: CloudDownload, keyTitle: "feat.offline.title", keyDesc: "feat.offline.desc", highlight: false, Component: OfflineFeature },
  { id: "reviews", icon: Star, keyTitle: "feat.reviews.title", keyDesc: "feat.reviews.desc", highlight: false, Component: ReviewsFeature },
  { id: "push", icon: Bell, keyTitle: "feat.push.title", keyDesc: "feat.push.desc", highlight: true, Component: PushFeature },
  { id: "ai", icon: Sparkles, keyTitle: "feat.ai.title", keyDesc: "feat.ai.desc", highlight: false, Component: null },
] as const;

export function SmartFeatures() {
  const { t } = useApp();

  return (
    <section id="features" className="relative bg-surface py-24 dark:bg-navy">
      <div className="absolute inset-0 bg-geo-pattern opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-turquoise">
            01 — Features
          </span>
          <h2 className="mt-2 font-display text-4xl font-bold text-navy dark:text-surface">
            {t("features.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-navy/60 dark:text-surface/60">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            const card = (
              <motion.article
                key={feat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group flex h-full flex-col rounded-2xl border p-6 backdrop-blur-xl transition-shadow ${
                  feat.highlight
                    ? "border-sand bg-gradient-to-br from-sand/20 to-turquoise/10 shadow-lg shadow-sand/20"
                    : "border-turquoise/15 bg-white/70 shadow-glass hover:border-turquoise/40 hover:shadow-glass-lg dark:border-white/10 dark:bg-navy-light/80"
                }`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    feat.highlight ? "bg-sand text-navy" : "bg-turquoise/15 text-turquoise"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-navy dark:text-surface">
                  {t(feat.keyTitle)}
                </h3>
                <p className="mt-2 flex-1 text-sm text-navy/60 dark:text-surface/60">
                  {t(feat.keyDesc)}
                </p>
                {feat.Component ? (
                  <div className="mt-4">
                    <feat.Component />
                  </div>
                ) : (
                  <a
                    href="#ai"
                    className="mt-4 inline-flex text-sm font-semibold text-turquoise hover:underline"
                  >
                    {t("common.open")} →
                  </a>
                )}
              </motion.article>
            );
            return card;
          })}
        </div>
      </div>
    </section>
  );
}
