"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";
import { AUDIO_TRACKS, MAP_PINS } from "@/data/tourism";
import type { Lang } from "@/lib/i18n";

const GUIDE_TEXT: Record<string, Record<Lang, string>> = {
  yasawi: {
    kk: "Хожа Ахмет Яссауи кесенесі — XIV ғасырдағы сәулет шедеврі. ЮНЕСКО әлемдік мұрасы.",
    ru: "Мавзолей Ходжи Ахмеда Ясави — шедевр архитектуры XIV века. Объект ЮНЕСКО.",
    en: "The Khoja Ahmed Yasawi Mausoleum is a 14th-century architectural masterpiece. UNESCO World Heritage.",
  },
  hazret: {
    kk: "Әзірет Сұлтан мешіті — Қазақстанның ең ірі мешіті.",
    ru: "Мечеть Әзірет Сұлтан — крупнейшая мечеть Казахстана.",
    en: "Hazret Sultan Mosque is the largest mosque in Kazakhstan.",
  },
  arystan: {
    kk: "Арыстан Баб — Яссауи шәкіртінің қасиетті орны.",
    ru: "Арыстан Баб — священное место ученика Ясави.",
    en: "Arystan Bab is the sacred site of Yasawi's disciple.",
  },
};

export function AudioFeature() {
  const { lang, t } = useApp();
  const [track, setTrack] = useState("yasawi");
  const [playing, setPlaying] = useState(false);
  const [audioLang, setAudioLang] = useState<Lang>(lang);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setAudioLang(lang);
  }, [lang]);

  const togglePlay = () => {
    if (playing) {
      speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const text = GUIDE_TEXT[track]?.[audioLang] ?? "";
    const u = new SpeechSynthesisUtterance(text);
    u.lang = audioLang === "kk" ? "kk-KZ" : audioLang === "ru" ? "ru-RU" : "en-US";
    u.onend = () => setPlaying(false);
    utterRef.current = u;
    speechSynthesis.speak(u);
    setPlaying(true);
  };

  useEffect(() => () => speechSynthesis.cancel(), []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-turquoise">
          {t("common.open")} →
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("feat.audio.title")}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          {(["kk", "ru", "en"] as Lang[]).map((l) => (
            <Button
              key={l}
              size="sm"
              variant={audioLang === l ? "default" : "ghost"}
              onClick={() => setAudioLang(l)}
            >
              {l.toUpperCase()}
            </Button>
          ))}
        </div>
        <ul className="space-y-2">
          {AUDIO_TRACKS.map((tr) => (
            <li key={tr.id}>
              <button
                type="button"
                onClick={() => setTrack(tr.id)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm ${
                  track === tr.id ? "border-turquoise bg-turquoise/5" : ""
                }`}
              >
                {MAP_PINS.find((p) => p.id === tr.id)?.name[lang]}
                <span className="text-navy/40">{tr.duration}</span>
              </button>
            </li>
          ))}
        </ul>
        <Button onClick={togglePlay} className="w-full gap-2">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <Volume2 className="h-4 w-4" />
          {playing
            ? lang === "kk"
              ? "Тоқтату"
              : lang === "ru"
                ? "Пауза"
                : "Pause"
            : lang === "kk"
              ? "Тыңдау"
              : lang === "ru"
                ? "Слушать"
                : "Play"}
        </Button>
        <p className="text-xs text-navy/50">{GUIDE_TEXT[track]?.[audioLang]}</p>
      </DialogContent>
    </Dialog>
  );
}
