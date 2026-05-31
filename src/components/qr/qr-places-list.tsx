"use client";

import Link from "next/link";
import { ExternalLink, QrCode } from "lucide-react";
import { PLACES } from "@/domain/data/places";
import { useTranslation } from "@/hooks/use-translation";
import { SafeImage } from "@/components/shared/safe-image";
import { placeImageUrl } from "@/lib/images";
import { qrTargetUrl } from "@/lib/qr/urls";
import { QrCodeImage } from "./qr-code-image";
import { cn } from "@/lib/utils";
import type { Place } from "@/domain/types";

const QR_PLACES = PLACES.filter((p) => p.qrCode);

type QrPlacesListProps = {
  compact?: boolean;
  className?: string;
};

export function QrPlacesList({ compact = false, className }: QrPlacesListProps) {
  const { t, loc } = useTranslation();

  return (
    <div className={cn("space-y-3", className)}>
      <p className={cn("text-charcoal/70", compact ? "text-xs" : "text-sm")}>
        {t("qr.listHint")}
      </p>
      <ul className={cn("space-y-3", compact && "max-h-[55vh] overflow-y-auto pr-1")}>
        {QR_PLACES.map((place) => (
          <QrPlaceCard key={place.id} place={place} compact={compact} loc={loc} t={t} />
        ))}
      </ul>
    </div>
  );
}

function QrPlaceCard({
  place,
  compact,
  loc,
  t,
}: {
  place: Place;
  compact: boolean;
  loc: (o: { kk: string; ru: string; en: string }) => string;
  t: (k: string) => string;
}) {
  const qrSize = compact ? 96 : 128;
  const scanUrl =
    typeof window !== "undefined" ? qrTargetUrl(place.id) : `/qr/${place.id}`;

  return (
    <li
      className={cn(
        "flex gap-3 rounded-xl border border-charcoal/10 bg-white p-3 shadow-sm",
        compact && "p-2.5"
      )}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg md:h-20 md:w-20">
        <SafeImage
          src={placeImageUrl(place.id)}
          alt={loc(place.name)}
          fill
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className={cn("font-semibold text-charcoal", compact ? "text-sm" : "text-base")}>
          {loc(place.name)}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-xs text-charcoal/60">{loc(place.description)}</p>
        {!compact && (
          <p className="mt-1 text-[11px] text-charcoal/45">
            {t("qr.hours")}: {loc(place.openingHours)}
          </p>
        )}
        <Link
          href={`/qr/${place.id}`}
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-heritage hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          {t("qr.openPage")}
        </Link>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1">
        <QrCodeImage placeId={place.id} size={qrSize} alt={`QR — ${loc(place.name)}`} />
        <span className="flex items-center gap-0.5 text-[10px] font-medium text-charcoal/50">
          <QrCode className="h-3 w-3" />
          {t("qr.scan")}
        </span>
        {!compact && (
          <p className="max-w-[120px] truncate text-[9px] text-charcoal/35" title={scanUrl}>
            {scanUrl.replace(/^https?:\/\//, "")}
          </p>
        )}
      </div>
    </li>
  );
}
