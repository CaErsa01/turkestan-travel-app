"use client";

import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "@/hooks/use-translation";
import { AiAssistantModule } from "@/modules/ai";

export default function AssistantPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <PageHeader title={t("ai.title")} backHref="/" />
      <AiAssistantModule showHeader />
    </div>
  );
}
