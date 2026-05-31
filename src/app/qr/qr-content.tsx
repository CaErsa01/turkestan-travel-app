"use client";

import { QrPlacesList } from "@/components/qr/qr-places-list";
import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "@/hooks/use-translation";

export function QrPlacesPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-2">
      <PageHeader title={t("qr.title")} backHref="/" />
      <p className="mb-4 text-sm text-charcoal/70">{t("qr.subtitle")}</p>
      <QrPlacesList />
    </div>
  );
}
