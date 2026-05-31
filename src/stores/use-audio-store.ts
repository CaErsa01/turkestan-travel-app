"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AudioState = {
  currentTrackId: string | null;
  isPlaying: boolean;
  progress: number;
  speed: number;
  playlist: string[];
  bookmarks: string[];
  setTrack: (id: string | null) => void;
  setPlaying: (v: boolean) => void;
  setProgress: (p: number) => void;
  setSpeed: (s: number) => void;
  setPlaylist: (ids: string[]) => void;
  toggleBookmark: (id: string) => void;
};

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      currentTrackId: null,
      isPlaying: false,
      progress: 0,
      speed: 1,
      playlist: [],
      bookmarks: [],
      setTrack: (currentTrackId) => set({ currentTrackId, progress: 0 }),
      setPlaying: (isPlaying) => set({ isPlaying }),
      setProgress: (progress) => set({ progress }),
      setSpeed: (speed) => set({ speed }),
      setPlaylist: (playlist) => set({ playlist }),
      toggleBookmark: (id) => {
        const b = get().bookmarks;
        set({
          bookmarks: b.includes(id) ? b.filter((x) => x !== id) : [...b, id],
        });
      },
    }),
    { name: "tt-audio", partialize: (s) => ({ bookmarks: s.bookmarks, speed: s.speed }) }
  )
);
