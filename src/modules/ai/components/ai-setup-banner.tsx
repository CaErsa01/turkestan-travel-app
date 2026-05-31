"use client";

import { ExternalLink, KeyRound } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

type Props = {
  setupUrl?: string;
};

export function AiSetupBanner({ setupUrl = "https://console.groq.com/keys" }: Props) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-charcoal">
      <div className="flex items-start gap-2">
        <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
        <div className="space-y-2">
          <p className="font-semibold text-amber-900">{t("ai.setup.title")}</p>
          <p className="text-xs leading-relaxed text-charcoal/80">{t("ai.setup.desc")}</p>
          <ol className="list-decimal space-y-1 pl-4 text-xs text-charcoal/75">
            <li>{t("ai.setup.step1")}</li>
            <li>{t("ai.setup.step2")}</li>
            <li>{t("ai.setup.step3")}</li>
          </ol>
          <a
            href={setupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-heritage px-3 py-1.5 text-xs font-semibold text-white hover:bg-heritage/90"
          >
            {t("ai.setup.cta")}
            <ExternalLink className="h-3 w-3" />
          </a>
          <p className="text-[10px] text-charcoal/50">{t("ai.setup.freeNote")}</p>
        </div>
      </div>
    </div>
  );
}
