"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/app-context";
import { DESTINATIONS } from "@/data/tourism";

const DEST_KEYS = ["yasawi", "karavan", "otyrar", "arystan"] as const;

export function Destinations() {
  const { t, setActivePin } = useApp();

  return (
    <section id="destinations" className="bg-white py-24 dark:bg-navy-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-turquoise">02</span>
          <h2 className="mt-2 font-display text-4xl font-bold text-navy dark:text-surface">
            {t("destinations.title")}
          </h2>
          <p className="mt-2 text-navy/60 dark:text-surface/60">{t("destinations.subtitle")}</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((dest, i) => {
            const key = DEST_KEYS[i];
            return (
              <motion.article
                key={dest.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-2xl shadow-glass-lg"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={dest.image}
                    alt={t(`dest.${key}`)}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                  <Badge className="absolute left-4 top-4">{dest.tag}</Badge>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-xl font-bold text-white">
                      {t(`dest.${key}`)}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePin(dest.id === "karavan" ? "bazaar" : dest.id);
                        document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="mt-3 flex items-center gap-1 text-sm font-medium text-turquoise-light transition hover:gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      {t("common.open")}
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
