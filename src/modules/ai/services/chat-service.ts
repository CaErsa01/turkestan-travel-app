import type { Locale } from "@/domain/types";
import type { AiUserPreferences, ApiChatMessage } from "../types";
import { formatAiError } from "./format-ai-error";
import { runGeminiChatStream, type ChatStreamCallbacks } from "./gemini-chat-service";
import { runGroqChatStream } from "./groq-chat-service";
import { resolveProvider } from "./resolve-provider";

export type { ChatStreamCallbacks };

export async function runAiChatStream(
  params: {
    messages: ApiChatMessage[];
    locale: Locale;
    preferences: AiUserPreferences;
  } & ChatStreamCallbacks
): Promise<void> {
  const provider = resolveProvider();
  if (!provider) {
    throw new Error(formatAiError(new Error("GROQ_API_KEY_MISSING"), params.locale));
  }

  if (provider === "groq") {
    return runGroqChatStream(params);
  }
  return runGeminiChatStream(params);
}
