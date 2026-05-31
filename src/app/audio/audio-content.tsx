"use client";

import { PageHeader } from "@/components/shared/page-header";
import { AudioComingSoon } from "@/components/audio/audio-coming-soon";
import { useTranslation } from "@/hooks/use-translation";

export function AudioPageContent() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t("audio.title")} backHref="/" />
      <AudioComingSoon />
    </div>
  );
}
