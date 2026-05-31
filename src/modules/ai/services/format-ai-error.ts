import type { Locale } from "@/domain/types";
import type { AiProvider } from "./resolve-provider";

const MESSAGES: Record<
  "missing" | "connection" | "quota" | "auth" | "generic",
  Record<Locale, string>
> = {
  missing: {
    kk: "AI key қойылмаған. Groq тегін key: console.groq.com/keys (карта керек емес, бағдарлама орнатпайсыз).",
    ru: "AI key не настроен. Бесплатный Groq key: console.groq.com/keys (без карты, без установки).",
    en: "AI key missing. Free Groq key: console.groq.com/keys (no card, no install).",
  },
  connection: {
    kk: "AI серверіне қосылу сәтсіз (SSL). .env.local файлына AI_INSECURE_TLS=1 қосып, dev server-ді қайта іске қосыңыз.",
    ru: "Не удалось подключиться к AI (SSL). Добавьте AI_INSECURE_TLS=1 в .env.local и перезапустите dev server.",
    en: "Could not connect to AI (SSL). Add AI_INSECURE_TLS=1 to .env.local and restart the dev server.",
  },
  quota: {
    kk: "AI күндік лимиті таусылды. Күте тұрыңыз немесе Groq-та жаңа тегін аккаунт ашыңыз.",
    ru: "Исчерпан дневной лимит AI. Подождите или создайте новый бесплатный аккаунт Groq.",
    en: "AI daily limit reached. Wait or create a new free Groq account.",
  },
  auth: {
    kk: "API key жарамсыз. console.groq.com/keys сайтында жаңа тегін key жасаңыз.",
    ru: "Неверный API key. Создайте новый бесплатный key на console.groq.com/keys.",
    en: "Invalid API key. Create a new free key at console.groq.com/keys.",
  },
  generic: {
    kk: "AI қызметі уақытша қолжетімсіз. Кейінірек қайталап көріңіз.",
    ru: "AI сервис временно недоступен. Попробуйте позже.",
    en: "AI service temporarily unavailable. Please try again later.",
  },
};

export function formatAiError(err: unknown, locale: Locale, provider?: AiProvider): string {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (
    message.includes("API_KEY_MISSING") ||
    message.includes("GROQ_API_KEY") ||
    message.includes("GEMINI_API_KEY")
  ) {
    return MESSAGES.missing[locale];
  }
  if (lower.includes("invalid api key") || lower.includes("401")) {
    return MESSAGES.auth[locale];
  }
  if (
    lower.includes("429") ||
    lower.includes("rate limit") ||
    lower.includes("quota") ||
    lower.includes("resource exhausted")
  ) {
    return MESSAGES.quota[locale];
  }
  if (
    lower.includes("fetch failed") ||
    lower.includes("network") ||
    lower.includes("econnrefused") ||
    lower.includes("unable_to_verify") ||
    lower.includes("certificate")
  ) {
    return MESSAGES.connection[locale];
  }
  if (provider === "gemini" && lower.includes("prepayment credits")) {
    return MESSAGES.missing[locale];
  }
  if (message) return message;
  return MESSAGES.generic[locale];
}
