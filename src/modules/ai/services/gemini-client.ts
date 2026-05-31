import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Locale } from "@/domain/types";

export function createGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  return new GoogleGenerativeAI(apiKey);
}

export function getGeminiModelName(): string {
  return process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";
}

const MESSAGES: Record<
  "missing" | "connection" | "quota" | "prepay" | "auth" | "generic",
  Record<Locale, string>
> = {
  missing: {
    kk: "Gemini API key қойылмаған. .env.local файлына GEMINI_API_KEY=... қосыңыз (тегін: aistudio.google.com/apikey).",
    ru: "Gemini API key не настроен. Добавьте GEMINI_API_KEY=... в .env.local (бесплатно: aistudio.google.com/apikey).",
    en: "Gemini API key is missing. Add GEMINI_API_KEY=... to .env.local (free at aistudio.google.com/apikey).",
  },
  connection: {
    kk: "Gemini API-ға қосылу сәтсіз. Интернетті тексеріп, dev server-ді қайта іске қосыңыз.",
    ru: "Не удалось подключиться к Gemini API. Проверьте интернет и перезапустите dev server.",
    en: "Could not connect to Gemini API. Check your internet and restart the dev server.",
  },
  quota: {
    kk: "Gemini лимиті таусылған. aistudio.google.com → Billing → кредит қосыңыз немесе жаңа тегін key жасаңыз.",
    ru: "Исчерпан лимит Gemini. aistudio.google.com → Billing → добавьте кредиты или создайте новый бесплатный key.",
    en: "Gemini quota exceeded. Go to aistudio.google.com → Billing → add credits or create a new free key.",
  },
  prepay: {
    kk: "Gemini алдын ала төлем кредиті таусылған. https://aistudio.google.com → Billing → кредит толықтырыңыз немесе жаңа project-те тегін key жасаңыз.",
    ru: "Предоплатные кредиты Gemini исчерпаны. https://aistudio.google.com → Billing → пополните или создайте key в новом проекте.",
    en: "Gemini prepayment credits depleted. https://aistudio.google.com → Billing → top up or create a key in a new project.",
  },
  auth: {
    kk: "Gemini API key жарамсыз. aistudio.google.com/apikey сайтында жаңа key жасаңыз.",
    ru: "Неверный Gemini API key. Создайте новый ключ на aistudio.google.com/apikey.",
    en: "Invalid Gemini API key. Create a new key at aistudio.google.com/apikey.",
  },
  generic: {
    kk: "AI қызметі уақытша қолжетімсіз. Кейінірек қайталап көріңіз.",
    ru: "AI сервис временно недоступен. Попробуйте позже.",
    en: "AI service temporarily unavailable. Please try again later.",
  },
};

export function formatGeminiError(err: unknown, locale: Locale): string {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (message.includes("GEMINI_API_KEY_MISSING")) return MESSAGES.missing[locale];
  if (message.includes("GEMINI_API_KEY")) return MESSAGES.missing[locale];
  if (lower.includes("api key not valid") || lower.includes("invalid api key")) {
    return MESSAGES.auth[locale];
  }
  if (lower.includes("prepayment credits are depleted")) {
    return MESSAGES.prepay[locale];
  }
  if (
    lower.includes("quota") ||
    lower.includes("rate limit") ||
    lower.includes("resource exhausted") ||
    lower.includes("429")
  ) {
    return MESSAGES.quota[locale];
  }
  if (lower.includes("fetch failed") || lower.includes("network") || lower.includes("econnrefused")) {
    return MESSAGES.connection[locale];
  }
  if (message) return message;
  return MESSAGES.generic[locale];
}
