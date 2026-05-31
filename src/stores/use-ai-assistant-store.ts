"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AiChatMessage } from "@/modules/ai/types";

function newId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type AiAssistantState = {
  sessionId: string;
  messages: AiChatMessage[];
  isStreaming: boolean;
  error: string | null;
  addUserMessage: (content: string) => string;
  beginAssistantMessage: () => string;
  appendAssistantToken: (messageId: string, token: string) => void;
  finalizeAssistantMessage: (
    messageId: string,
    metadata?: AiChatMessage["metadata"]
  ) => void;
  setStreaming: (v: boolean) => void;
  setError: (msg: string | null) => void;
  clearChat: () => void;
};

export const useAiAssistantStore = create<AiAssistantState>()(
  persist(
    (set, get) => ({
      sessionId: `ai-${Date.now()}`,
      messages: [],
      isStreaming: false,
      error: null,

      addUserMessage: (content) => {
        const id = newId();
        set({
          messages: [
            ...get().messages,
            { id, role: "user", content, createdAt: Date.now() },
          ],
          error: null,
        });
        return id;
      },

      beginAssistantMessage: () => {
        const id = newId();
        set({
          messages: [
            ...get().messages,
            {
              id,
              role: "assistant",
              content: "",
              createdAt: Date.now(),
              isStreaming: true,
            },
          ],
          isStreaming: true,
        });
        return id;
      },

      appendAssistantToken: (messageId, token) => {
        set({
          messages: get().messages.map((m) =>
            m.id === messageId ? { ...m, content: m.content + token } : m
          ),
        });
      },

      finalizeAssistantMessage: (messageId, metadata) => {
        set({
          messages: get().messages.map((m) =>
            m.id === messageId
              ? { ...m, isStreaming: false, metadata }
              : m
          ),
          isStreaming: false,
        });
      },

      setStreaming: (isStreaming) => set({ isStreaming }),
      setError: (error) => set({ error, isStreaming: false }),

      clearChat: () =>
        set({
          sessionId: `ai-${Date.now()}`,
          messages: [],
          error: null,
          isStreaming: false,
        }),
    }),
    {
      name: "tt-ai-assistant",
      partialize: (s) => ({
        sessionId: s.sessionId,
        messages: s.messages.map((m) => ({ ...m, isStreaming: false })),
      }),
    }
  )
);
