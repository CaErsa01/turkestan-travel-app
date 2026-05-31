"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  Route,
  Calendar,
  User,
  Home,
  Headphones,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useAppStore } from "@/stores/use-app-store";
import type { Locale } from "@/domain/types";

const MAIN_NAV = [
  { href: "/map", icon: Map, key: "nav.map" },
  { href: "/routes", icon: Route, key: "nav.routes" },
  { href: "/booking", icon: Calendar, key: "nav.booking" },
  { href: "/profile", icon: User, key: "nav.profile" },
] as const;

const MORE_LINKS = [
  { href: "/audio", icon: Headphones, label: "Audio" },
  { href: "/assistant", icon: MessageCircle, label: "AI" },
  { href: "/reviews", icon: MessageCircle, label: "Reviews" },
  { href: "/help", icon: HelpCircle, label: "Help" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);

  const isAppRoute = pathname !== "/";

  if (!isAppRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-charcoal">
            <Home className="h-5 w-5 text-heritage" />
            Turkistan<span className="text-heritage">Travel</span>
          </Link>
          <div className="flex items-center gap-1">
            {(["kk", "ru", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={cn(
                  "rounded px-2 py-1 text-xs font-semibold uppercase",
                  locale === l ? "bg-heritage text-white" : "text-charcoal/60 hover:bg-charcoal/5"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <nav className="hidden border-t border-charcoal/5 md:block">
          <div className="mx-auto flex max-w-6xl gap-1 px-4 py-2">
            {MAIN_NAV.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium",
                  pathname.startsWith(href)
                    ? "bg-heritage text-white"
                    : "text-charcoal/70 hover:bg-charcoal/5"
                )}
              >
                {t(key)}
              </Link>
            ))}
            {MORE_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium",
                  pathname.startsWith(href)
                    ? "bg-heritage text-white"
                    : "text-charcoal/70 hover:bg-charcoal/5"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-charcoal/10 bg-white md:hidden"
        aria-label="Main navigation"
      >
        <div className="flex justify-around py-2">
          {MAIN_NAV.map(({ href, icon: Icon, key }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium",
                pathname.startsWith(href) ? "text-heritage" : "text-charcoal/50"
              )}
            >
              <Icon className="h-5 w-5" />
              {t(key)}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
