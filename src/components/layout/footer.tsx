"use client";

import Link from "next/link";
import { Instagram, Facebook, Send, Mail, Phone, MapPin } from "lucide-react";
import { useApp } from "@/context/app-context";
import { AccountDialog } from "@/components/features/account-dialog";
import { FeedbackDialog } from "@/components/features/feedback-dialog";

export function Footer() {
  const { t } = useApp();

  return (
    <footer className="border-t border-turquoise/10 bg-navy text-surface dark:border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Link href="#home" className="font-display text-2xl font-bold">
            Turkestan<span className="text-turquoise-light">Travel</span>
          </Link>
          <p className="mt-3 max-w-md text-sm text-surface/70">{t("footer.tagline")}</p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Send].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-surface/80 transition hover:border-turquoise hover:text-turquoise-light"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-turquoise-light">
            Contacts
          </h3>
          <ul className="space-y-3 text-sm text-surface/70">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-turquoise" /> Turkestan, Kazakhstan
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-turquoise" /> +7 (725) 33-XX-XX
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-turquoise" /> info@turkestan-travel.kz
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <AccountDialog />
          <FeedbackDialog />
          <a href="#features" className="text-sm text-surface/70 hover:text-turquoise-light">
            {t("nav.features")}
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-surface/50">
        {t("footer.rights")}
      </div>
    </footer>
  );
}
