"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Navigation, Share2 } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { placeImageUrl } from "@/lib/images";
import { fetchQrContent, fetchPlace } from "@/lib/api/places";
import { useTranslation } from "@/hooks/use-translation";
import { useUserStore } from "@/stores/use-user-store";
import { PLACES } from "@/domain/data/places";
import { getNearbyPlaces } from "@/domain/place-utils";
import { mapsDirectionsUrl } from "@/lib/utils/geo";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { QrCodeImage } from "@/components/qr/qr-code-image";

export default function QrGuidePage() {
  const params = useParams();
  const id = params.id as string;
  const { loc, t } = useTranslation();
  const addQrHistory = useUserStore((s) => s.addQrHistory);

  const { data: content, isLoading, isError } = useQuery({
    queryKey: ["qr", id],
    queryFn: () => fetchQrContent(id),
    retry: false,
  });

  const { data: place } = useQuery({
    queryKey: ["place", id],
    queryFn: () => fetchPlace(id),
    enabled: !!content,
  });

  useEffect(() => {
    if (content) addQrHistory(id);
  }, [content, id, addQrHistory]);

  if (isLoading) return <LoadingState label={t("common.loading")} />;
  if (isError || !content)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <ErrorState message={t("qr.invalid")} />
        <Link href="/qr" className="btn-primary mt-6">
          {t("qr.title")}
        </Link>
      </div>
    );

  const nearby = place ? getNearbyPlaces(place, PLACES) : [];
  const gallery = place?.images?.length ? place.images : content.gallery;

  return (
    <div className="mx-auto max-w-lg pb-24">
      <div className="relative aspect-video overflow-hidden rounded-b-2xl">
        <SafeImage
          src={placeImageUrl(id)}
          alt={place ? loc(place.name) : id}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            {t("qr.scanned")}
          </p>
          <h1 className="font-display text-2xl font-bold text-white">
            {place ? loc(place.name) : id}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <p className="text-base leading-relaxed text-charcoal/80">{loc(content.summary)}</p>

        {place && (
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-charcoal/70">
            <span className="flex items-center gap-1.5 rounded-full bg-charcoal/5 px-3 py-1">
              <Clock className="h-4 w-4 text-heritage" />
              {loc(place.openingHours)}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-charcoal/5 px-3 py-1">
              <MapPin className="h-4 w-4 text-heritage" />
              {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
            </span>
          </div>
        )}

        <section className="mt-6">
          <h2 className="font-display text-lg font-bold text-charcoal">{t("qr.history")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{loc(content.history)}</p>
        </section>

        {content.audioGuide.length > 0 && (
          <p className="mt-4 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-center text-xs text-charcoal/70">
            {t("audio.comingSoon.title")}
          </p>
        )}

        {gallery.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-lg font-bold text-charcoal">{t("qr.gallery")}</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {gallery.slice(0, 4).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                  <SafeImage
                    src={img.startsWith("http") ? img : placeImageUrl(id)}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {place && (
          <a
            href={mapsDirectionsUrl(place.latitude, place.longitude, loc(place.name))}
            className="btn-primary mt-6 flex w-full items-center justify-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            {t("map.route")}
          </a>
        )}

        {nearby.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-lg font-bold text-charcoal">{t("qr.nearby")}</h2>
            <ul className="mt-2 space-y-2">
              {nearby.map((p) =>
                p ? (
                  <li key={p.id}>
                    <Link
                      href={`/qr/${p.id}`}
                      className="flex items-center gap-2 rounded-lg border border-charcoal/10 px-3 py-2 text-sm font-medium text-heritage hover:bg-heritage/5"
                    >
                      {loc(p.name)} →
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </section>
        )}

        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-charcoal/10 bg-white p-4">
          <p className="text-xs text-charcoal/50">{t("qr.shareCode")}</p>
          <QrCodeImage placeId={id} size={120} alt="QR" />
          <button
            type="button"
            className="btn-secondary w-full"
            onClick={() =>
              navigator.share?.({
                title: place ? loc(place.name) : "Turkistan",
                url: window.location.href,
              })
            }
          >
            <Share2 className="mr-1 inline h-4 w-4" />
            {t("qr.share")}
          </button>
          <Link href="/qr" className="text-xs font-semibold text-heritage hover:underline">
            ← {t("qr.allPlaces")}
          </Link>
        </div>
      </div>
    </div>
  );
}
