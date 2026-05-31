"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import type { Lang } from "@/lib/i18n";
import { LANG_LABELS } from "@/lib/i18n";

const NAV = [
  { href: "#home", key: "nav.home" },
  { href: "#features", key: "nav.features" },
  { href: "#destinations", key: "nav.destinations" },
  { href: "#dashboard", key: "nav.dashboard" },
  { href: "#ai", key: "nav.ai" },
];

export function Navbar() {
  const { t, lang, setLang } = useApp();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const langs: Lang[] = ["kk", "ru", "en"];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-navy/90 shadow-lg backdrop-blur-xl dark:bg-navy/95"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#home" className="flex items-center gap-2 font-display text-xl font-bold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-turquoise text-sm">☪</span>
          <span>
            Turkestan<span className="text-turquoise-light">Travel</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm font-medium text-white/80 transition hover:text-turquoise-light"
              >
                {t(item.key)}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="relative">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setLangOpen(!langOpen)}
              className="gap-1"
            >
              <Globe className="h-4 w-4" />
              {LANG_LABELS[lang]}
            </Button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-full mt-2 min-w-[100px] overflow-hidden rounded-xl border border-white/10 bg-navy-light shadow-lg"
                >
                  {langs.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => {
                        setLang(l);
                        setLangOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-turquoise/20 ${
                        lang === l ? "text-turquoise-light" : "text-white/80"
                      }`}
                    >
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            variant="glass"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild variant="secondary" size="sm">
            <a href="#booking">{t("nav.book")}</a>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-navy/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 p-4">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block rounded-lg px-4 py-3 text-white/90 hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
              <li className="flex gap-2 pt-2">
                {langs.map((l) => (
                  <Button
                    key={l}
                    variant={lang === l ? "default" : "glass"}
                    size="sm"
                    onClick={() => setLang(l)}
                  >
                    {LANG_LABELS[l]}
                  </Button>
                ))}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
