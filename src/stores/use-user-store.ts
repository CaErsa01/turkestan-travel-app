"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, BookingRecord, FeedbackTicket } from "@/domain/types";

type UserState = {
  profile: UserProfile | null;
  savedPlaceIds: string[];
  savedRouteIds: string[];
  wishlistIds: string[];
  bookings: BookingRecord[];
  qrHistory: string[];
  downloadedAudioIds: string[];
  notificationsEnabled: boolean;
  aiPreferences: {
    interests: string[];
    mobility: string;
    budgetKzt?: number;
    durationDays?: number;
    travelingWithChildren?: boolean;
  };
  feedbackTickets: FeedbackTicket[];
  setProfile: (p: UserProfile | null) => void;
  toggleSavedPlace: (id: string) => void;
  toggleSavedRoute: (id: string) => void;
  toggleWishlist: (id: string) => void;
  addBooking: (b: BookingRecord) => void;
  addQrHistory: (id: string) => void;
  toggleDownloadedAudio: (id: string) => void;
  setNotifications: (v: boolean) => void;
  setAiPreferences: (p: Partial<UserState["aiPreferences"]>) => void;
  addFeedback: (t: FeedbackTicket) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      savedPlaceIds: [],
      savedRouteIds: [],
      wishlistIds: [],
      bookings: [],
      qrHistory: [],
      downloadedAudioIds: [],
      notificationsEnabled: true,
      aiPreferences: { interests: [], mobility: "walk" },
      feedbackTickets: [],
      setProfile: (profile) => set({ profile }),
      toggleSavedPlace: (id) => {
        const cur = get().savedPlaceIds;
        set({
          savedPlaceIds: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
        });
      },
      toggleSavedRoute: (id) => {
        const cur = get().savedRouteIds;
        set({
          savedRouteIds: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
        });
      },
      toggleWishlist: (id) => {
        const cur = get().wishlistIds;
        set({
          wishlistIds: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
        });
      },
      addBooking: (b) => set({ bookings: [b, ...get().bookings] }),
      addQrHistory: (id) => {
        const hist = [id, ...get().qrHistory.filter((x) => x !== id)].slice(0, 20);
        set({ qrHistory: hist });
      },
      toggleDownloadedAudio: (id) => {
        const cur = get().downloadedAudioIds;
        set({
          downloadedAudioIds: cur.includes(id)
            ? cur.filter((x) => x !== id)
            : [...cur, id],
        });
      },
      setNotifications: (notificationsEnabled) => set({ notificationsEnabled }),
      setAiPreferences: (p) =>
        set({ aiPreferences: { ...get().aiPreferences, ...p } }),
      addFeedback: (t) => set({ feedbackTickets: [t, ...get().feedbackTickets] }),
    }),
    { name: "tt-user" }
  )
);
