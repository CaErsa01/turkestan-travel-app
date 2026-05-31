"use client";

import { PLACES } from "@/domain/data/places";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { useRoutesModuleStore } from "../store/use-routes-module-store";
import { GoogleMapProvider } from "@/modules/map/google/google-map-provider";
import { useRoutePath } from "../hooks/use-route-path";

function PlannerSummary() {
  const plannerStopIds = useRoutesModuleStore((s) => s.plannerStopIds);
  const plannerMode = useRoutesModuleStore((s) => s.plannerMode);
  const { path, loading } = useRoutePath(plannerStopIds, plannerMode);
  const { t, loc } = useTranslation();

  if (plannerStopIds.length === 0) {
    return <p className="text-xs text-charcoal/50">{t("routes.planner.empty")}</p>;
  }

  return (
    <div className="text-xs text-charcoal/70">
      {loading ? (
        t("routes.planner.calculating")
      ) : path ? (
        <p>
          {path.distanceKm} {t("common.km")} · {path.durationMin} {t("routes.stop.min")} ·{" "}
          {t("routes.planner.stops", { count: plannerStopIds.length })}
          {path.source === "estimated" && ` (${t("routes.map.estimated")})`}
        </p>
      ) : null}
      <ol className="mt-2 list-decimal pl-4">
        {plannerStopIds.map((id) => {
          const place = PLACES.find((p) => p.id === id);
          return <li key={id}>{place ? loc(place.name) : id}</li>;
        })}
      </ol>
    </div>
  );
}

export function RoutePlannerPanel() {
  const { t, loc } = useTranslation();
  const plannerStopIds = useRoutesModuleStore((s) => s.plannerStopIds);
  const plannerMode = useRoutesModuleStore((s) => s.plannerMode);
  const addPlannerStop = useRoutesModuleStore((s) => s.addPlannerStop);
  const removePlannerStop = useRoutesModuleStore((s) => s.removePlannerStop);
  const reorderPlannerStop = useRoutesModuleStore((s) => s.reorderPlannerStop);
  const setPlannerMode = useRoutesModuleStore((s) => s.setPlannerMode);
  const savePlannerAsCustom = useRoutesModuleStore((s) => s.savePlannerAsCustom);
  const clearPlanner = useRoutesModuleStore((s) => s.clearPlanner);

  return (
    <GoogleMapProvider>
      <div className="panel-light space-y-4 p-4">
        <h3 className="font-semibold">{t("routes.planner.title")}</h3>
        <p className="text-xs text-charcoal/60">{t("routes.planner.desc")}</p>

        <select
          value={plannerMode}
          onChange={(e) => setPlannerMode(e.target.value as typeof plannerMode)}
          className="rounded border px-2 py-1 text-xs"
        >
          <option value="walking">{t("routes.transport.walking")}</option>
          <option value="driving">{t("routes.transport.driving")}</option>
          <option value="mixed">{t("routes.transport.mixed")}</option>
        </select>

        <div className="max-h-40 overflow-y-auto rounded border border-charcoal/10 p-2">
          <p className="mb-2 text-xs font-medium">{t("routes.planner.addPlaces")}</p>
          <div className="flex flex-wrap gap-1">
            {PLACES.slice(0, 8).map((p) => (
              <button
                key={p.id}
                type="button"
                disabled={plannerStopIds.includes(p.id)}
                onClick={() => addPlannerStop(p.id)}
                className="rounded-full bg-charcoal/5 px-2 py-0.5 text-[10px] disabled:opacity-40"
              >
                + {loc(p.name)}
              </button>
            ))}
          </div>
        </div>

        {plannerStopIds.length > 0 && (
          <ul className="space-y-1 text-xs">
            {plannerStopIds.map((id, index) => {
              const place = PLACES.find((p) => p.id === id);
              return (
                <li key={id} className="flex items-center justify-between rounded bg-white px-2 py-1">
                  <span>
                    {index + 1}. {place ? loc(place.name) : id}
                  </span>
                  <div className="flex gap-1">
                    {index > 0 && (
                      <button type="button" onClick={() => reorderPlannerStop(index, index - 1)}>↑</button>
                    )}
                    {index < plannerStopIds.length - 1 && (
                      <button type="button" onClick={() => reorderPlannerStop(index, index + 1)}>↓</button>
                    )}
                    <button type="button" onClick={() => removePlannerStop(id)} className="text-red-500">×</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <PlannerSummary />

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            disabled={plannerStopIds.length < 2}
            onClick={() =>
              savePlannerAsCustom(
                `${t("routes.planner.customPrefix")} ${new Date().toLocaleDateString()}`
              )
            }
          >
            {t("routes.planner.save")}
          </Button>
          <Button size="sm" variant="secondary" onClick={clearPlanner}>
            {t("routes.planner.clear")}
          </Button>
        </div>
      </div>
    </GoogleMapProvider>
  );
}
