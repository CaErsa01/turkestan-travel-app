"use client";

import { PageHeader } from "@/components/shared/page-header";
import { RoutesModule } from "@/modules/routes";
import { useTranslation } from "@/hooks/use-translation";

export default function RoutesPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t("routes.title")} backHref="/" />
      <RoutesModule variant="page" />
    </div>
  );
}
