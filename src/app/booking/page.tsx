"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { BookingPartnersPanel } from "@/components/booking/booking-partners-panel";
import { useTranslation } from "@/hooks/use-translation";

export default function BookingPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t("booking.title")} backHref="/" />
      <BookingPartnersPanel />
      <Link href="/" className="btn-secondary mt-6 inline-flex">
        ← {t("nav.home")}
      </Link>
    </div>
  );
}
