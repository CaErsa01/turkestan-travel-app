"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Landmark,
  MapPin,
  Users,
  Globe,
  Map,
  Bed,
  Calendar,
  Headphones,
  QrCode,
  Wifi,
  TrendingUp,
  Leaf,
  Handshake,
  Heart,
  Shield,
  TreePine,
  Smile,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useAppStore } from "@/stores/use-app-store";
import type { Locale } from "@/domain/types";

const LANDMARKS = [
  { icon: Landmark, kk: "Хожа Ахмет Яссауи кесенесі", desc: "ЮНЕСКО әлемдік мұрасы" },
  { icon: MapPin, kk: "Отырар қаласы", desc: "Ежелгі түркі өркениетінің орталығы" },
  { icon: Landmark, kk: "Арыстан Баб кесенесі", desc: "Қасиетті және тарихи орын" },
  { icon: MapPin, kk: "Заманауи нысандар", desc: "Караван-сарай, конгресс-холл" },
];

const APP_FEATURES = [
  { icon: Map, href: "/map" },
  { icon: Bed, href: "/booking" },
  { icon: Calendar, href: "/routes" },
  { icon: Headphones, href: "/audio" },
  { icon: QrCode, href: "/qr/yasawi" },
  { icon: Wifi, href: "/profile" },
];

const APP_LABELS = ["Карта", "Қонақ үй", "Экскурсия", "Аудиогид", "QR", "Офлайн"];

const BENEFITS = [
  { icon: TrendingUp, key: "benefits.economy" },
  { icon: Leaf, key: "benefits.culture" },
  { icon: Handshake, key: "benefits.image" },
];

const FOOTER_VALUES = [
  { icon: Heart, key: "footer.hospitable" },
  { icon: Shield, key: "footer.safe" },
  { icon: TreePine, key: "footer.green" },
  { icon: Smile, key: "footer.friendly" },
];

export function LandingPage() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-charcoal/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <span className="font-display text-xl font-bold tracking-wide text-charcoal">
            Turkistan<span className="text-heritage">Travel</span>
          </span>
          <div className="flex items-center gap-2">
            {(["kk", "ru", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={`rounded px-2 py-1 text-xs font-bold uppercase ${
                  locale === l ? "bg-charcoal text-cream" : "text-charcoal/50"
                }`}
              >
                {l}
              </button>
            ))}
            <Link href="/map" className="btn-primary ml-2 hidden sm:inline-flex">
              {t("hero.cta")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr_320px] lg:gap-6">
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-5xl font-bold leading-none tracking-tight text-charcoal md:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-charcoal/80 md:text-base">
              {t("hero.subtitle")}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/70 md:text-base">
              {t("hero.intro")}
            </p>
            <Link href="/map" className="btn-primary mt-8 w-fit lg:hidden">
              {t("hero.cta")}
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-panel lg:aspect-auto lg:min-h-[320px]">
            <Image
              src="https://images.unsplash.com/photo-1587974922339-957f8180e1da?w=1200&q=80"
              alt="Khoja Ahmed Yasawi Mausoleum"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <aside className="panel-dark p-6 lg:self-start">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-cream/70">
              {t("facts.title")}
            </h2>
            <ul className="space-y-4 text-sm">
              <FactItem icon={Landmark} text={t("facts.age")} />
              <FactItem icon={MapPin} text={t("facts.location")} />
              <FactItem icon={Users} text={t("facts.center")} />
              <FactItem icon={Globe} text={t("facts.tourism")} />
            </ul>
          </aside>
        </div>
      </section>

      {/* Three columns: landmarks | app | benefits */}
      <section className="border-t border-charcoal/10 bg-white/40 py-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-3">
          <div>
            <h2 className="section-heading mb-6">{t("landmarks.title")}</h2>
            <ul className="space-y-5">
              {LANDMARKS.map((item, i) => (
                <li key={i} className="flex gap-4 border-b border-charcoal/10 pb-5 last:border-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-charcoal/15 bg-cream">
                    <item.icon className="h-6 w-6 text-heritage" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal">{item.kk}</p>
                    <p className="mt-1 text-sm text-charcoal/60">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/map" className="mt-6 inline-block text-sm font-semibold text-heritage hover:underline">
              {t("nav.map")} →
            </Link>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="relative mx-auto w-[220px] rounded-[2rem] border-[10px] border-charcoal bg-charcoal p-2 shadow-panel">
              <div className="overflow-hidden rounded-[1.25rem] bg-cream">
                <div className="bg-heritage px-3 py-2 text-center text-xs font-bold text-white">
                  Turkistan Travel
                </div>
                <ul className="space-y-0 p-2 text-left text-[10px]">
                  {["Интерактивті карта", "Дайын маршруттар", "Онлайн брондау", "QR / Аудиогид", "Офлайн режим"].map(
                    (label) => (
                      <li key={label} className="flex items-center gap-2 border-b border-charcoal/5 py-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-heritage" />
                        {label}
                      </li>
                    )
                  )}
                </ul>
                <div className="flex justify-around border-t border-charcoal/10 py-2 text-[8px] text-charcoal/50">
                  <span>Home</span>
                  <span className="text-heritage font-bold">Map</span>
                  <span>Book</span>
                  <span>Profile</span>
                </div>
              </div>
            </div>
            <h2 className="mt-6 font-display text-xl font-bold text-charcoal">{t("app.title")}</h2>
            <p className="mt-2 max-w-xs text-sm text-charcoal/60">{t("app.desc")}</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {APP_FEATURES.map((f, i) => (
                <Link
                  key={i}
                  href={f.href}
                  className="flex flex-col items-center gap-1 rounded-lg border border-charcoal/10 bg-cream p-3 transition hover:border-heritage hover:shadow-card"
                >
                  <f.icon className="h-5 w-5 text-heritage" strokeWidth={1.5} />
                  <span className="text-[10px] font-medium text-charcoal/80">{APP_LABELS[i]}</span>
                </Link>
              ))}
            </div>
            <Link href="/map" className="btn-primary mt-8">
              {t("hero.cta")}
            </Link>
          </div>

          <div>
            <h2 className="section-heading mb-6">{t("benefits.title")}</h2>
            <ul className="space-y-6">
              {BENEFITS.map(({ icon: Icon, key }) => (
                <li key={key} className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-heritage/15">
                    <Icon className="h-7 w-7 text-heritage" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm leading-relaxed text-charcoal/80">{t(key)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="panel-dark mt-4 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-cream md:text-base">
            {t("footer.slogan")}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {FOOTER_VALUES.map(({ icon: Icon, key }) => (
              <div key={key} className="flex flex-col items-center gap-2">
                <Icon className="h-6 w-6 text-heritage-light" strokeWidth={1.5} />
                <span className="text-xs text-cream/80">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function FactItem({ icon: Icon, text }: { icon: typeof Landmark; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-heritage-light" strokeWidth={1.5} />
      <span className="text-cream/90">{text}</span>
    </li>
  );
}
