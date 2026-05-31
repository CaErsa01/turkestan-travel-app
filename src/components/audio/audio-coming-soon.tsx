"use client";

import { Headphones, Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
  className?: string;
};

export function AudioComingSoon({ compact, className }: Props) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        compact ? "py-6 px-2" : "panel-light py-12 px-6",
        className
      )}
    >
      <div className="relative mb-4">
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl bg-heritage/10 text-heritage",
            compact ? "h-14 w-14" : "h-20 w-20"
          )}
        >
          <Headphones className={compact ? "h-7 w-7" : "h-10 w-10"} strokeWidth={1.5} />
        </div>
        <span className="absolute -right-1 -top-1 flex items-center gap-0.5 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-charcoal">
          <Sparkles className="h-3 w-3" />
          {t("audio.comingSoon.badge")}
        </span>
      </div>

      <h2 className={cn("font-display font-bold text-charcoal", compact ? "text-lg" : "text-2xl")}>
        {t("audio.comingSoon.title")}
      </h2>
      <p className={cn("mt-2 max-w-md text-charcoal/65", compact ? "text-xs" : "text-sm")}>
        {t("audio.comingSoon.desc")}
      </p>

      {!compact && (
        <ul className="mt-6 space-y-2 text-left text-xs text-charcoal/55">
          {(["1", "2", "3"] as const).map((n) => (
            <li key={n} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-heritage" />
              {t(`audio.comingSoon.feature${n}`)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
