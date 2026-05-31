"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Review } from "@/domain/types";

type ReviewState = {
  reviews: Review[];
  filterRating: number | null;
  sortBy: "newest" | "helpful" | "highest" | "lowest";
  addReview: (r: Omit<Review, "id" | "createdAt" | "helpful">) => void;
  voteHelpful: (id: string) => void;
  setFilterRating: (r: number | null) => void;
  setSortBy: (s: ReviewState["sortBy"]) => void;
};

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [] as Review[],
      filterRating: null,
      sortBy: "newest",
      addReview: (r) => {
        const review: Review = {
          ...r,
          id: `r-${Date.now()}`,
          createdAt: new Date().toISOString().split("T")[0],
          helpful: 0,
        };
        set({ reviews: [review, ...get().reviews] });
      },
      voteHelpful: (id) => {
        set({
          reviews: get().reviews.map((rev) =>
            rev.id === id ? { ...rev, helpful: rev.helpful + 1 } : rev
          ),
        });
      },
      setFilterRating: (filterRating) => set({ filterRating }),
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    { name: "tt-reviews-v2" }
  )
);
