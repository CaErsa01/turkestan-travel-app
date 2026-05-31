"use client";

import type { AiRoutePlan } from "../types";

type Props = {
  plan: AiRoutePlan;
  labels: {
    duration: string;
    budget: string;
    transport: string;
    stops: string;
  };
};

export function AiRoutePlanCard({ plan, labels }: Props) {
  return (
    <div className="mt-3 rounded-xl border border-heritage/20 bg-white/80 p-3 text-xs">
      <p className="font-semibold text-heritage">{plan.name}</p>
      <p className="mt-1 text-charcoal/70">{plan.explanation}</p>
      <dl className="mt-2 grid grid-cols-2 gap-1 text-charcoal/60">
        <div>
          <dt className="font-medium">{labels.duration}</dt>
          <dd>{plan.durationHours}h</dd>
        </div>
        {plan.budgetKzt != null && (
          <div>
            <dt className="font-medium">{labels.budget}</dt>
            <dd>{plan.budgetKzt.toLocaleString()} ₸</dd>
          </div>
        )}
        <div className="col-span-2">
          <dt className="font-medium">{labels.transport}</dt>
          <dd>{plan.transport}</dd>
        </div>
      </dl>
      <p className="mt-2 font-medium text-charcoal/70">{labels.stops}</p>
      <ol className="mt-1 list-decimal space-y-0.5 pl-4 text-charcoal/80">
        {plan.stops.map((s) => (
          <li key={`${s.order}-${s.placeId}`}>
            {s.order}. {s.name}
            <span className="text-charcoal/40"> · ~{s.durationMin} min</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
