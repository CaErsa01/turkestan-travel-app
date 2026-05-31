"use client";

import { usePathname } from "next/navigation";
import { Play, Pause, SkipForward } from "lucide-react";
import { useAudioStore } from "@/stores/use-audio-store";
import { AUDIO_TRACKS } from "@/domain/data/places";
import { useTranslation } from "@/hooks/use-translation";

export function AudioPlayerBar() {
  const pathname = usePathname();
  const trackId = useAudioStore((s) => s.currentTrackId);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const progress = useAudioStore((s) => s.progress);
  const speed = useAudioStore((s) => s.speed);
  const setPlaying = useAudioStore((s) => s.setPlaying);
  const setProgress = useAudioStore((s) => s.setProgress);
  const setSpeed = useAudioStore((s) => s.setSpeed);
  const { loc } = useTranslation();

  if (!trackId || pathname === "/" || pathname.startsWith("/qr")) return null;

  const track = AUDIO_TRACKS.find((t) => t.id === trackId);
  if (!track) return null;

  const duration = track.durationSec;
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-charcoal/10 bg-white px-4 py-2 shadow-panel md:bottom-0">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying(!isPlaying)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-heritage text-white"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{loc(track.title)}</p>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-charcoal/10">
            <div className="h-full bg-heritage transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="rounded border border-charcoal/15 text-xs"
          aria-label="Playback speed"
        >
          <option value={0.75}>0.75×</option>
          <option value={1}>1×</option>
          <option value={1.25}>1.25×</option>
          <option value={1.5}>1.5×</option>
        </select>
        <button
          type="button"
          onClick={() => setProgress(Math.min(progress + 30, duration))}
          aria-label="Skip"
        >
          <SkipForward className="h-4 w-4 text-charcoal/60" />
        </button>
      </div>
    </div>
  );
}
