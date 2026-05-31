"use client";

import { useState } from "react";
import { Star } from "lucide-react";
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

export function ReviewsFeature() {
  const { lang, t, reviews, addReview, toast } = useApp();
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const submit = () => {
    if (!author.trim() || !text.trim()) return;
    addReview({ author, text, rating });
    setAuthor("");
    setText("");
    toast(lang === "kk" ? "Пікір қосылды!" : lang === "ru" ? "Отзыв добавлен!" : "Review added!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-turquoise">
          {t("common.open")} →
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("feat.reviews.title")}</DialogTitle>
        </DialogHeader>
        <div className="max-h-48 space-y-3 overflow-y-auto">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-navy/10 p-3 text-sm">
              <div className="flex gap-0.5 text-sand">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-sand" />
                ))}
              </div>
              <p className="mt-1 italic text-navy/70">«{r.text}»</p>
              <p className="mt-1 text-xs font-semibold">
                {r.author} · {r.date}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="p-1"
            >
              <Star
                className={`h-5 w-5 ${n <= rating ? "fill-sand text-sand" : "text-navy/20"}`}
              />
            </button>
          ))}
        </div>
        <Input
          placeholder={lang === "kk" ? "Атыңыз" : lang === "ru" ? "Имя" : "Name"}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <Input
          placeholder={lang === "kk" ? "Пікір" : lang === "ru" ? "Отзыв" : "Review"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={submit}>{lang === "kk" ? "Жіберу" : lang === "ru" ? "Отправить" : "Submit"}</Button>
      </DialogContent>
    </Dialog>
  );
}
