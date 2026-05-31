"use client";

import { useCallback } from "react";
import type { Locale } from "@/domain/types";
import type { AiResponseMetadata, AiStreamEvent, ApiChatMessage, AiUserPreferences } from "@/modules/ai/types";
import { useAiAssistantStore } from "@/stores/use-ai-assistant-store";

async function parseNdjsonStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onEvent: (event: AiStreamEvent) => void
) {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        onEvent(JSON.parse(line) as AiStreamEvent);
      } catch {
        /* skip malformed line */
      }
    }
  }

  if (buffer.trim()) {
    try {
      onEvent(JSON.parse(buffer) as AiStreamEvent);
    } catch {
      /* ignore */
    }
  }
}

export function useAiChat(params: {
  locale: Locale;
  preferences: AiUserPreferences;
}) {
  const {
    messages,
    isStreaming,
    error,
    sessionId,
    addUserMessage,
    beginAssistantMessage,
    appendAssistantToken,
    finalizeAssistantMessage,
    setError,
    clearChat,
  } = useAiAssistantStore();

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

      addUserMessage(trimmed);
      const assistantId = beginAssistantMessage();

      const history: ApiChatMessage[] = [
        ...useAiAssistantStore
          .getState()
          .messages.filter((m) => m.id !== assistantId && m.content.trim())
          .map((m) => ({
            role: m.role,
            content: m.content,
          })),
      ];

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            locale: params.locale,
            preferences: params.preferences,
            sessionId,
          }),
        });

        if (!res.ok) {
          const errBody = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(errBody?.error ?? `Request failed (${res.status})`);
        }

        if (!res.body) throw new Error("No response stream");

        let metadata: AiResponseMetadata | undefined;

        await parseNdjsonStream(res.body.getReader(), (event) => {
          if (event.type === "token") {
            appendAssistantToken(assistantId, event.content);
          } else if (event.type === "metadata") {
            metadata = event.data;
          } else if (event.type === "error") {
            setError(event.message);
            appendAssistantToken(assistantId, `\n\n⚠ ${event.message}`);
          }
        });

        finalizeAssistantMessage(assistantId, metadata);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        appendAssistantToken(assistantId, msg);
        finalizeAssistantMessage(assistantId);
      }
    },
    [
      addUserMessage,
      appendAssistantToken,
      beginAssistantMessage,
      finalizeAssistantMessage,
      isStreaming,
      params.locale,
      params.preferences,
      sessionId,
      setError,
    ]
  );

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    clearChat,
  };
}
