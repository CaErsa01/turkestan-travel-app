"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { BookingPartnersPanel } from "@/components/booking/booking-partners-panel";
import { AudioComingSoon } from "@/components/audio/audio-coming-soon";
import { LoadingState } from "@/components/shared/loading-state";
import { QrPlacesList } from "@/components/qr/qr-places-list";

const MapModule = dynamic(
  () => import("@/modules/map").then((m) => m.MapModule),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading map…" />,
  }
);

const AiAssistantModule = dynamic(
  () => import("@/modules/ai").then((m) => m.AiAssistantModule),
  { ssr: false, loading: () => <LoadingState label="AI…" /> }
);

export type FeatureId =
  | "map"
  | "routes"
  | "booking"
  | "audio"
  | "qr"
  | "ai"
  | "reviews"
  | "mobile"
  | "help";

export function FeaturePanel({ id }: { id: FeatureId }) {
  const { t } = useTranslation();

  if (id === "map") return <MapPanel />;
  if (id === "routes") return <RoutesPanel />;
  if (id === "booking") return <BookingPanel />;
  if (id === "audio") return <AudioPanel />;
  if (id === "qr") return <QrPanel />;
  if (id === "ai") return <AiPanel />;
  if (id === "reviews") return <ReviewsPanel />;
  if (id === "mobile") return <MobilePanel t={t} />;
  if (id === "help") return <HelpPanel />;

  return null;
}

function MapPanel() {
  return <MapModule variant="embedded" />;
}

const RoutesModule = dynamic(
  () => import("@/modules/routes").then((m) => m.RoutesModule),
  {
    ssr: false,
    loading: () => <LoadingState label="Loading routes…" />,
  }
);

function RoutesPanel() {
  return (
    <div className="max-h-[60vh] overflow-y-auto">
      <RoutesModule variant="embedded" showPlanner={false} compact />
    </div>
  );
}

function BookingPanel() {
  const { t } = useTranslation();
  return (
    <div className="max-h-[60vh] overflow-y-auto space-y-3">
      <BookingPartnersPanel compact />
      <Link href="/booking" className="block text-center text-sm font-semibold text-heritage hover:underline">
        {t("booking.title")} →
      </Link>
    </div>
  );
}

function AudioPanel() {
  return <AudioComingSoon compact />;
}

function QrPanel() {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <QrPlacesList compact />
      <Link href="/qr" className="block text-center text-xs font-semibold text-heritage hover:underline">
        {t("qr.viewAll")} →
      </Link>
    </div>
  );
}

function AiPanel() {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <AiAssistantModule compact />
      <Link href="/assistant" className="text-xs font-semibold text-heritage underline">
        {t("ai.title")} →
      </Link>
    </div>
  );
}

function ReviewsPanel() {
  return (
    <p className="text-sm">
      <Link href="/reviews" className="text-heritage font-semibold underline">
        Пікірлер →
      </Link>
    </p>
  );
}

function MobilePanel({ t }: { t: (k: string) => string }) {
  return (
    <div className="text-sm text-charcoal/80 space-y-2">
      <p>{t("feat.mobile.desc")}</p>
      <ul className="list-disc pl-4 text-xs space-y-1">
        <li>{t("feat.mobile.1")}</li>
        <li>{t("feat.mobile.2")}</li>
        <li>{t("feat.mobile.3")}</li>
      </ul>
    </div>
  );
}

function HelpPanel() {
  return (
    <p className="text-sm">
      <Link href="/help" className="text-heritage font-semibold underline">
        FAQ & кері байланыс →
      </Link>
      <span className="block mt-2 text-xs text-charcoal/50">info@turkestan-travel.kz</span>
    </p>
  );
}
