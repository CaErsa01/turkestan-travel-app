import type { Content } from "@google/generative-ai";
import type { Locale } from "@/domain/types";
import type { AiResponseMetadata, AiUserPreferences, ApiChatMessage } from "../types";
import { buildSystemPrompt } from "../prompts/system-prompt";
import { AI_FUNCTION_DECLARATIONS } from "../tools/definitions";
import { createMetadataCollector, executeTool } from "../tools/handlers";
import { createGeminiClient } from "./gemini-client";
import { formatAiError } from "./format-ai-error";
import { getProviderModel } from "./resolve-provider";

const MAX_TOOL_ROUNDS = 8;

export type ChatStreamCallbacks = {
  onToken: (text: string) => void;
  onMetadata: (meta: AiResponseMetadata) => void;
};

function toGeminiContents(messages: ApiChatMessage[]): Content[] {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function runGeminiChatStream(
  params: {
    messages: ApiChatMessage[];
    locale: Locale;
    preferences: AiUserPreferences;
  } & ChatStreamCallbacks
): Promise<void> {
  const genAI = createGeminiClient();
  const model = genAI.getGenerativeModel({
    model: getProviderModel("gemini"),
    systemInstruction: buildSystemPrompt(params.locale, params.preferences),
    tools: [{ functionDeclarations: AI_FUNCTION_DECLARATIONS }],
  });

  const collector = createMetadataCollector();
  let contents: Content[] = toGeminiContents(params.messages);

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const result = await model.generateContentStream({ contents });

      for await (const chunk of result.stream) {
        try {
          const text = chunk.text();
          if (text) params.onToken(text);
        } catch {
          /* functionCall chunk */
        }
      }

      const response = await result.response;
      const calls = response.functionCalls?.() ?? [];

      if (calls.length > 0) {
        contents.push({
          role: "model",
          parts: calls.map((call) => ({
            functionCall: { name: call.name, args: call.args },
          })),
        });

        contents.push({
          role: "user",
          parts: calls.map((call) => {
            const toolResult = executeTool(
              call.name,
              (call.args ?? {}) as Record<string, unknown>,
              collector,
              params.locale
            );
            return {
              functionResponse: {
                name: call.name,
                response: toolResult as object,
              },
            };
          }),
        });
        continue;
      }

      params.onMetadata(collector.finalize(params.locale));
      return;
    }

    params.onMetadata(collector.finalize(params.locale));
  } catch (err) {
    throw new Error(formatAiError(err, params.locale, "gemini"));
  }
}
