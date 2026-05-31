"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchTourRoute } from "@/modules/routes";
import { RouteDetailPanel } from "@/modules/routes";
import { useRoutesModuleStore } from "@/modules/routes";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { useTranslation } from "@/hooks/use-translation";

export default function RouteDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { t, loc } = useTranslation();
  const addRecent = useRoutesModuleStore((s) => s.addRecent);

  const { data: route, isLoading, isError, refetch } = useQuery({
    queryKey: ["tour-route", id],
    queryFn: () => fetchTourRoute(id),
  });

  useEffect(() => {
    if (route) addRecent(route.id);
  }, [route, addRecent]);

  if (isLoading) return <LoadingState label={t("routes.loadingRoute")} />;
  if (isError || !route)
    return <ErrorState message={t("routes.notFound")} onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader title={loc(route.title)} backHref="/routes" />
      <RouteDetailPanel route={route} variant="page" />
    </div>
  );
}
