"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Trash2, Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useUserStore } from "@/stores/use-user-store";
import { AI_QUICK_PROMPTS } from "../constants/quick-prompts";
import { useAiChat } from "../hooks/use-ai-chat";
import { AiMessageBubble } from "./ai-message-bubble";
import { AiSetupBanner } from "./ai-setup-banner";

type Props = {
  compact?: boolean;
  showHeader?: boolean;
};

export function AiAssistantModule({ compact = false, showHeader = false }: Props) {
  const { t, locale } = useTranslation();
  const aiPreferences = useUserStore((s) => s.aiPreferences);
  const [input, setInput] = useState("");
  const [aiReady, setAiReady] = useState<boolean | null>(null);
  const [setupUrl, setSetupUrl] = useState("https://console.groq.com/keys");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, isStreaming, error, sendMessage, clearChat } = useAiChat({
    locale,
    preferences: aiPreferences,
  });

  useEffect(() => {
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then((d: { configured?: boolean; setupUrl?: string }) => {
        setAiReady(Boolean(d.configured));
        if (d.setupUrl) setSetupUrl(d.setupUrl);
      })
      .catch(() => setAiReady(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const promptLabel = (key: string) => {
    const p = AI_QUICK_PROMPTS.find((x) => x.key === key);
    if (!p) return key;
    return p[locale];
  };

  const routeLabels = {
    duration: t("ai.route.duration"),
    budget: t("ai.route.budget"),
    transport: t("ai.route.transport"),
    stops: t("ai.route.stops"),
  };

  const onSubmit = (text: string) => {
    if (!text.trim() || isStreaming || aiReady === false) return;
    sendMessage(text);
    setInput("");
  };

  const chatDisabled = isStreaming || aiReady === false;

  const handleClearHistory = () => {
    if (isStreaming || messages.length === 0) return;
    if (typeof window !== "undefined" && !window.confirm(t("ai.clearConfirm"))) return;
    clearChat();
  };

  return (
    <div
      className={
        compact
          ? "flex flex-col"
          : "flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border border-charcoal/10 bg-white"
      }
    >
      {showHeader && (
        <div className="flex items-center gap-2 border-b border-charcoal/10 px-4 py-2 text-sm font-semibold text-heritage">
          <Sparkles className="h-4 w-4" />
          {t("ai.title")}
        </div>
      )}

      <div
        className={`flex-1 space-y-3 overflow-y-auto ${compact ? "max-h-64 p-2" : "p-4"}`}
      >
        {aiReady === false && <AiSetupBanner setupUrl={setupUrl} />}
        {messages.length === 0 && aiReady !== false && (
          <div className="rounded-xl bg-cream/80 p-4 text-sm text-charcoal/70">
            <p className="font-medium text-charcoal">{t("ai.welcome")}</p>
            <p className="mt-1 text-xs">{t("ai.welcomeHint")}</p>
          </div>
        )}
        {messages.map((msg) => (
          <AiMessageBubble key={msg.id} message={msg} labels={routeLabels} />
        ))}
        {error && (
          <p className="text-center text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={`border-t border-charcoal/10 ${compact ? "p-2" : "p-3"}`}>
        {messages.length > 0 && (
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={handleClearHistory}
              disabled={isStreaming}
              className="inline-flex items-center gap-1.5 rounded-lg border border-charcoal/15 bg-white px-2.5 py-1.5 text-xs font-medium text-charcoal/70 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
              aria-label={t("ai.clear")}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("ai.clear")}
            </button>
          </div>
        )}
        <div className="mb-2 flex flex-wrap gap-1">
          {AI_QUICK_PROMPTS.map((p) => (
            <button
              key={p.key}
              type="button"
              disabled={chatDisabled}
              onClick={() => onSubmit(p[locale])}
              className="rounded-full bg-cream px-2 py-1 text-[10px] font-medium text-charcoal/80 transition hover:bg-heritage/10 disabled:opacity-50"
            >
              {promptLabel(p.key)}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={chatDisabled}
            placeholder={
              aiReady === false ? t("ai.setup.placeholder") : t("ai.placeholder")
            }
            className="flex-1 rounded-lg border border-charcoal/15 px-3 py-2 text-sm disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={chatDisabled || !input.trim()}
            className="btn-primary disabled:opacity-50"
            aria-label={t("ai.send")}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
