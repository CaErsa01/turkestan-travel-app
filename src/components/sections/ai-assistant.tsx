"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/app-context";

type Message = { role: "user" | "ai"; text: string };

const AI_RESPONSES: Record<string, Record<"kk" | "ru" | "en", string[]>> = {
  default: {
    kk: [
      "Бүгін Хожа Ахмет Яссауи кесенесіне баруды ұсынамын — таңертең 09:00-да аз адам болады.",
      "2 күндік «Толық мәдениет туры» сізге ұнайды: кесене + мұражай + базар.",
      "Арыстан Баб кесенесіне түс қалса, ол Түркістаннан 12 км қашықта.",
    ],
    ru: [
      "Сегодня рекомендую посетить мавзолей Ходжи Ахмеда Ясави — утром в 09:00 меньше людей.",
      "Вам подойдёт 2-дневный культурный тур: мавзолей + музей + базар.",
      "Если есть время — мавзолей Арыстан Баба в 12 км от Туркестана.",
    ],
    en: [
      "Today I recommend the Khoja Ahmed Yasawi Mausoleum — fewer crowds at 09:00 AM.",
      "The 2-day Full Culture Tour fits well: mausoleum + museum + bazaar.",
      "If you have time, Arystan Bab Mausoleum is 12 km from Turkestan.",
    ],
  },
  visit: {
    kk: ["Кесене → Мұражай → Әзірет Сұлтан мешіті — классикалық 1 күндік маршрут."],
    ru: ["Мавзолей → Музей → Мечеть Әзірет Сұлтан — классический маршрут на 1 день."],
    en: ["Mausoleum → Museum → Hazret Sultan Mosque — classic 1-day route."],
  },
  food: {
    kk: ["Түркістан базарында бешбармақ пен наурыз көже дәмін татыңыз!"],
    ru: ["На базаре Туркестана попробуйте бешбармак и наурыз көже!"],
    en: ["Try beshbarmak and nauryz kozhe at Turkestan Bazaar!"],
  },
};

function getAiReply(input: string, lang: "kk" | "ru" | "en"): string {
  const lower = input.toLowerCase();
  if (lower.includes("visit") || lower.includes("бару") || lower.includes("посет"))
    return AI_RESPONSES.visit[lang][0];
  if (lower.includes("food") || lower.includes("тағам") || lower.includes("еда"))
    return AI_RESPONSES.food[lang][0];
  const pool = AI_RESPONSES.default[lang];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function AiAssistant() {
  const { lang, t } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text:
        lang === "kk"
          ? "Сәлем! Мен сіздің Түркістан AI көмекшіңізбін. Бүгін неге бару керек?"
          : lang === "ru"
            ? "Привет! Я ваш AI-помощник по Туркестану. Что посетить сегодня?"
            : "Hello! I'm your Turkestan AI guide. What should you visit today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "ai", text: getAiReply(userMsg, lang) },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <section id="ai" className="relative overflow-hidden bg-navy py-24">
      <div className="absolute inset-0 bg-geo-pattern opacity-20" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-turquoise/20">
            <Sparkles className="h-7 w-7 text-turquoise-light" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white">{t("ai.title")}</h2>
          <p className="mt-2 text-white/60">{t("ai.subtitle")}</p>
        </motion.div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-glass-lg backdrop-blur-xl">
          <div className="max-h-80 space-y-4 overflow-y-auto p-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "ai" ? "bg-turquoise/30" : "bg-sand/30"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <Bot className="h-4 w-4 text-turquoise-light" />
                  ) : (
                    <span className="text-xs font-bold text-sand">You</span>
                  )}
                </div>
                <p
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "ai"
                      ? "bg-white/10 text-white/90"
                      : "bg-turquoise text-white"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
            {typing && (
              <p className="text-sm text-white/40 animate-pulse">...</p>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="flex gap-2 border-t border-white/10 p-4">
            <Input
              className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
              placeholder={t("ai.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <Button onClick={send} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
