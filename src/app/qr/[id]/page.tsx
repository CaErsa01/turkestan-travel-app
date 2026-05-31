"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { SafeImage } from "@/components/shared/safe-image";
import { placeImageUrl } from "@/lib/images";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchQrContent, fetchPlace } from "@/lib/api/places";
import { useTranslation } from "@/hooks/use-translation";
import { useUserStore } from "@/stores/use-user-store";
import { PLACES } from "@/domain/data/places";
import { getNearbyPlaces } from "@/domain/place-utils";
import { mapsDirectionsUrl } from "@/lib/utils/geo";
import { Share2, Download, Navigation } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";

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
        <Link href="/map" className="btn-primary mt-6">
          {t("nav.map")}
        </Link>
      </div>
    );

  const nearby = place ? getNearbyPlaces(place, PLACES) : [];

  return (
    <div className="mx-auto max-w-lg pb-24">
      <div className="relative aspect-video overflow-hidden rounded-b-2xl">
        <SafeImage src={placeImageUrl(id)} alt="" fill priority className="object-cover" />
      </div>
      <div className="px-4 py-6">
        <h1 className="font-display text-2xl font-bold">
          {place ? loc(place.name) : id}
        </h1>
        <p className="mt-2 text-charcoal/70">{loc(content.summary)}</p>
        <section className="mt-6">
          <h2 className="font-semibold">History</h2>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{loc(content.history)}</p>
        </section>
        <p className="mt-4 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-center text-xs text-charcoal/70">
          {t("audio.comingSoon.title")}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {content.gallery.slice(0, 4).map((_, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
              <SafeImage src={placeImageUrl(`${id}-${i}`)} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
        {place && (
          <a
            href={mapsDirectionsUrl(place.latitude, place.longitude)}
            className="btn-secondary mt-4 flex w-full items-center justify-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            Route
          </a>
        )}
        {nearby.length > 0 && (
          <section className="mt-6">
            <h2 className="font-semibold">Nearby</h2>
            <ul className="mt-2 space-y-1">
              {nearby.map((p) =>
                p ? (
                  <li key={p.id}>
                    <Link href={`/qr/${p.id}`} className="text-heritage">
                      {loc(p.name)}
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </section>
        )}
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={() => navigator.share?.({ title: "Turkistan", url: window.location.href })}
          >
            <Share2 className="mr-1 inline h-4 w-4" />
            Share
          </button>
          <button type="button" className="btn-secondary flex-1">
            <Download className="mr-1 inline h-4 w-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
