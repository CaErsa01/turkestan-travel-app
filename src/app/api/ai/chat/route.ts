import { runAiChatStream } from "@/modules/ai/services/chat-service";
import type { AiChatRequestBody, AiStreamEvent } from "@/modules/ai/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function encodeEvent(event: AiStreamEvent): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`);
}

export async function POST(req: Request) {
  let body: AiChatRequestBody;
  try {
    body = (await req.json()) as AiChatRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const locale = body.locale ?? "en";
  const preferences = body.preferences ?? { interests: [], mobility: "walk" };
  const messages = (body.messages ?? []).slice(-24).filter((m) => m.content?.trim());

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return Response.json({ error: "Last message must be from user" }, { status: 400 });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: AiStreamEvent) => controller.enqueue(encodeEvent(event));

      try {
        await runAiChatStream({
          messages,
          locale,
          preferences,
          onToken: (content) => send({ type: "token", content }),
          onMetadata: (data) => send({ type: "metadata", data }),
        });
        send({ type: "done" });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "AI service unavailable";
        send({ type: "error", message });
        send({ type: "done" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
