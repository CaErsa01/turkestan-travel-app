"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";

export function FeedbackDialog() {
  const { lang, t, toast } = useApp();
  const [msg, setMsg] = useState("");

  const send = () => {
    if (!msg.trim()) return;
    console.log("Feedback:", msg);
    setMsg("");
    toast(lang === "kk" ? "Рахмет! Хабарлама жіберілді." : lang === "ru" ? "Спасибо! Сообщение отправлено." : "Thank you! Message sent.");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2 border-white/20 text-surface">
          <MessageCircle className="h-4 w-4" />
          {t("feedback.title")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("feedback.title")}</DialogTitle>
        </DialogHeader>
        <textarea
          className="min-h-[120px] w-full rounded-xl border border-turquoise/20 bg-white p-4 text-sm outline-none focus:border-turquoise dark:bg-navy dark:text-surface"
          placeholder={
            lang === "kk"
              ? "Пікіріңізді жазыңыз..."
              : lang === "ru"
                ? "Напишите отзыв..."
                : "Write your feedback..."
          }
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <Button onClick={send}>{t("common.save")}</Button>
      </DialogContent>
    </Dialog>
  );
}
