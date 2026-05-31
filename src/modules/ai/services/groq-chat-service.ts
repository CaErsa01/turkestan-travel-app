import type { Locale } from "@/domain/types";
import type { AiResponseMetadata, AiUserPreferences, ApiChatMessage } from "../types";
import { buildSystemPrompt } from "../prompts/system-prompt";
import { AI_OPENAI_TOOLS } from "../tools/openai-tools";
import { createMetadataCollector, executeTool } from "../tools/handlers";
import { formatAiError } from "./format-ai-error";
import { getAiFetch } from "./ai-fetch";
import { getProviderModel } from "./resolve-provider";

const MAX_TOOL_ROUNDS = 8;
const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";

export type ChatStreamCallbacks = {
  onToken: (text: string) => void;
  onMetadata: (meta: AiResponseMetadata) => void;
};

type GroqMessage =
  | { role: "system" | "user" | "assistant"; content: string | null }
  | {
      role: "assistant";
      content: string | null;
      tool_calls: Array<{
        id: string;
        type: "function";
        function: { name: string; arguments: string };
      }>;
    }
  | { role: "tool"; tool_call_id: string; content: string };

async function* parseSseJson(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        yield JSON.parse(data) as Record<string, unknown>;
      } catch {
        /* skip */
      }
    }
  }
}

function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) throw new Error("GROQ_API_KEY_MISSING");
  return key;
}

export async function runGroqChatStream(
  params: {
    messages: ApiChatMessage[];
    locale: Locale;
    preferences: AiUserPreferences;
  } & ChatStreamCallbacks
): Promise<void> {
  const collector = createMetadataCollector();
  const model = getProviderModel("groq");

  const conversation: GroqMessage[] = [
    { role: "system", content: buildSystemPrompt(params.locale, params.preferences) },
    ...params.messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const res = await getAiFetch()(GROQ_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getGroqApiKey()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: conversation,
          tools: AI_OPENAI_TOOLS,
          tool_choice: "auto",
          stream: true,
          temperature: 0.35,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`${res.status} ${errText.slice(0, 200)}`);
      }

      if (!res.body) throw new Error("No response stream");

      let assistantContent = "";
      const toolCalls = new Map<number, { id: string; name: string; arguments: string }>();

      for await (const chunk of parseSseJson(res.body)) {
        const choices = chunk.choices as Array<{
          delta?: {
            content?: string;
            tool_calls?: Array<{
              index?: number;
              id?: string;
              function?: { name?: string; arguments?: string };
            }>;
          };
          finish_reason?: string | null;
        }> | undefined;
        const choice = choices?.[0];
        if (!choice?.delta) continue;

        if (choice.delta.content) {
          assistantContent += choice.delta.content;
          params.onToken(choice.delta.content);
        }

        if (choice.delta.tool_calls) {
          for (const tc of choice.delta.tool_calls) {
            const idx = tc.index ?? 0;
            if (!toolCalls.has(idx)) {
              toolCalls.set(idx, { id: tc.id ?? "", name: "", arguments: "" });
            }
            const cur = toolCalls.get(idx)!;
            if (tc.id) cur.id = tc.id;
            if (tc.function?.name) cur.name = tc.function.name;
            if (tc.function?.arguments) cur.arguments += tc.function.arguments;
          }
        }
      }

      const toolCallsList = Array.from(toolCalls.values()).filter((t) => t.name && t.id);

      if (toolCallsList.length > 0) {
        conversation.push({
          role: "assistant",
          content: assistantContent || null,
          tool_calls: toolCallsList.map((tc) => ({
            id: tc.id,
            type: "function" as const,
            function: { name: tc.name, arguments: tc.arguments || "{}" },
          })),
        });

        for (const tc of toolCallsList) {
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(tc.arguments || "{}") as Record<string, unknown>;
          } catch {
            args = {};
          }
          const result = executeTool(tc.name, args, collector, params.locale);
          conversation.push({
            role: "tool",
            tool_call_id: tc.id,
            content: JSON.stringify(result),
          });
        }
        continue;
      }

      params.onMetadata(collector.finalize(params.locale));
      return;
    }

    params.onMetadata(collector.finalize(params.locale));
  } catch (err) {
    throw new Error(formatAiError(err, params.locale, "groq"));
  }
}
