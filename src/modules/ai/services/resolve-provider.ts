export type AiProvider = "groq" | "gemini";

export function resolveProvider(): AiProvider | null {
  const forced = process.env.AI_PROVIDER?.trim().toLowerCase();
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  if (forced === "groq") return groqKey ? "groq" : null;
  if (forced === "gemini") return geminiKey ? "gemini" : null;

  if (groqKey) return "groq";
  if (geminiKey) return "gemini";
  return null;
}

export function getProviderModel(provider: AiProvider): string {
  if (provider === "groq") {
    return process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  }
  return process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";
}

export const GROQ_SETUP_URL = "https://console.groq.com/keys";
export const GEMINI_SETUP_URL = "https://aistudio.google.com/apikey";

export function getSetupUrl(provider: AiProvider | null): string {
  if (provider === "gemini") return GEMINI_SETUP_URL;
  return GROQ_SETUP_URL;
}
