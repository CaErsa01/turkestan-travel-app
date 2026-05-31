"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/app-context";
import { AnimatedCounter } from "@/components/animated-counter";
import { STATS } from "@/data/tourism";

export function Hero() {
  const { t } = useApp();

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1587974922339-957f8180e1da?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/70 to-turquoise/40" />
      <div className="absolute inset-0 bg-geo-pattern opacity-40" />

      <motion.div
        className="absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-turquoise/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <Badge className="mb-6 border border-turquoise/30 bg-turquoise/20 text-turquoise-light">
            {t("hero.badge")}
          </Badge>
          <h1 className="font-display text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
            {t("hero.title")}
            <span className="mt-2 block text-turquoise-light">{t("hero.titleAccent")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">{t("hero.subtitle")}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <a href="#features">
                {t("hero.cta1")}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#dashboard">
                <MapPin className="h-4 w-4" />
                {t("hero.cta2")}
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.key}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
            >
              <p className="font-display text-2xl font-bold text-turquoise-light sm:text-3xl">
                <AnimatedCounter
                  value={stat.value}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  delay={i * 0.1}
                />
              </p>
              <p className="text-xs text-white/70 sm:text-sm">{t(`stat.${stat.key}`)}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
