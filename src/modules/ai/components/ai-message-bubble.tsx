"use client";

import { Sparkles } from "lucide-react";
import type { AiChatMessage } from "../types";
import { AiTypingIndicator } from "./ai-typing-indicator";
import { AiSuggestedActions } from "./ai-suggested-actions";
import { AiRoutePlanCard } from "./ai-route-plan-card";

type Labels = {
  duration: string;
  budget: string;
  transport: string;
  stops: string;
};

type Props = {
  message: AiChatMessage;
  labels: Labels;
};

export function AiMessageBubble({ message, labels }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser ? "bg-heritage text-white" : "bg-cream text-charcoal"
        }`}
      >
        {!isUser && <Sparkles className="mb-1 h-4 w-4 text-heritage" aria-hidden />}
        {message.content ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : message.isStreaming ? (
          <AiTypingIndicator />
        ) : null}
        {message.isStreaming && message.content ? (
          <div className="mt-2">
            <AiTypingIndicator />
          </div>
        ) : null}

        {!isUser && message.metadata?.routePlan && (
          <AiRoutePlanCard plan={message.metadata.routePlan} labels={labels} />
        )}

        {!isUser && message.metadata?.places && message.metadata.places.length > 0 && (
          <ul className="mt-2 space-y-1 border-t border-charcoal/10 pt-2 text-[11px] text-charcoal/60">
            {message.metadata.places.slice(0, 5).map((p) => (
              <li key={p.id}>
                <span className="font-medium text-charcoal/80">{p.name}</span>
                <span className="text-charcoal/40">
                  {" "}
                  · {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {!isUser && message.metadata?.actions && !message.isStreaming && (
          <AiSuggestedActions actions={message.metadata.actions} />
        )}
      </div>
    </div>
  );
}
