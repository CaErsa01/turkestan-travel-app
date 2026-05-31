"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "@/hooks/use-translation";
import { useReviewStore } from "@/stores/use-review-store";
import { useAppStore } from "@/stores/use-app-store";
import { PLACES } from "@/domain/data/places";
import { ThumbsUp, Star, Loader2, X } from "lucide-react";

const reviewSchema = z.object({
  placeId: z.string().min(1),
  author: z.string().min(2),
  email: z.union([z.literal(""), z.string().email()]),
  rating: z.number().min(1).max(5),
  text: z.string().min(10),
});

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="p-0.5 transition-transform hover:scale-110"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} stars`}
        >
          <Star
            className={`h-7 w-7 ${
              n <= active ? "fill-amber-400 text-amber-400" : "text-charcoal/25"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewsPageContent() {
  const { t, loc } = useTranslation();
  const searchParams = useSearchParams();
  const placeFilter = searchParams.get("place");
  const showToast = useAppStore((s) => s.showToast);
  const reviews = useReviewStore((s) => s.reviews);
  const filterRating = useReviewStore((s) => s.filterRating);
  const sortBy = useReviewStore((s) => s.sortBy);
  const setFilterRating = useReviewStore((s) => s.setFilterRating);
  const setSortBy = useReviewStore((s) => s.setSortBy);
  const addReview = useReviewStore((s) => s.addReview);
  const voteHelpful = useReviewStore((s) => s.voteHelpful);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    let list = placeFilter ? reviews.filter((r) => r.placeId === placeFilter) : reviews;
    if (filterRating) list = list.filter((r) => r.rating === filterRating);
    if (sortBy === "newest") list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sortBy === "helpful") list = [...list].sort((a, b) => b.helpful - a.helpful);
    if (sortBy === "highest") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === "lowest") list = [...list].sort((a, b) => a.rating - b.rating);
    return list;
  }, [reviews, placeFilter, filterRating, sortBy]);

  const avg =
    filtered.length > 0
      ? (filtered.reduce((s, r) => s + r.rating, 0) / filtered.length).toFixed(1)
      : "—";

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: filtered.filter((r) => r.rating === star).length,
  }));

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      placeId: placeFilter ?? PLACES[0]?.id ?? "yasawi",
      author: "",
      email: "",
      rating: 5,
      text: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: values.placeId,
          author: values.author,
          email: values.email || undefined,
          rating: values.rating,
          text: values.text,
        }),
      });

      if (!res.ok) throw new Error("submit failed");

      addReview({
        placeId: values.placeId,
        author: values.author,
        rating: values.rating,
        text: values.text,
      });
      showToast(t("reviews.success"));
      setShowForm(false);
      form.reset({
        placeId: placeFilter ?? PLACES[0]?.id ?? "yasawi",
        author: "",
        email: "",
        rating: 5,
        text: "",
      });
    } catch {
      showToast(t("reviews.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title={t("reviews.title")} backHref="/" />

      <div className="panel-light mb-6 p-4">
        <p className="text-3xl font-bold">{avg}</p>
        <p className="text-sm text-charcoal/60">
          {t("reviews.count", { count: filtered.length })}
        </p>
        <div className="mt-3 space-y-1">
          {breakdown.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span>{star}★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-charcoal/10">
                <div
                  className="h-full bg-heritage"
                  style={{ width: `${filtered.length ? (count / filtered.length) * 100 : 0}%` }}
                />
              </div>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select
          value={filterRating ?? ""}
          onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value="">{t("reviews.allRatings")}</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {t("reviews.stars", { n })}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value="newest">{t("reviews.sort.newest")}</option>
          <option value="helpful">{t("reviews.sort.helpful")}</option>
          <option value="highest">{t("reviews.sort.highest")}</option>
          <option value="lowest">{t("reviews.sort.lowest")}</option>
        </select>
        <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>
          {t("reviews.submit")}
        </button>
      </div>

      <ul className="space-y-4">
        {filtered.length === 0 && (
          <li className="panel-light p-8 text-center text-sm text-charcoal/60">
            {t("reviews.empty")}
          </li>
        )}
        {filtered.map((r) => {
          const place = PLACES.find((p) => p.id === r.placeId);
          return (
            <li key={r.id} className="panel-light p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-heritage/20 text-sm font-bold text-heritage">
                    {r.author[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.author}</p>
                    {place && (
                      <p className="text-xs text-charcoal/50">{loc(place.name)}</p>
                    )}
                    {r.verified && (
                      <span className="text-[10px] text-green-600">{t("reviews.verified")}</span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-charcoal/80">{r.text}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-charcoal/50">
                <span>{r.createdAt}</span>
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-heritage"
                  onClick={() => voteHelpful(r.id)}
                >
                  <ThumbsUp className="h-3 w-3" />
                  {t("reviews.helpful")} ({r.helpful})
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => !submitting && setShowForm(false)}
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{t("reviews.submit")}</h2>
              <button
                type="button"
                className="rounded-full p-1 hover:bg-charcoal/5"
                onClick={() => !submitting && setShowForm(false)}
                aria-label={t("reviews.cancel")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-charcoal/60">
                  {t("reviews.place")}
                </label>
                <select
                  {...form.register("placeId")}
                  className="w-full rounded-lg border border-charcoal/15 px-3 py-2.5 text-sm"
                >
                  {PLACES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {loc(p.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-charcoal/60">
                  {t("reviews.rating")}
                </label>
                <Controller
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <StarPicker value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-charcoal/60">
                  {t("reviews.author")}
                </label>
                <input
                  {...form.register("author")}
                  placeholder={t("reviews.authorPlaceholder")}
                  className="w-full rounded-lg border border-charcoal/15 px-3 py-2.5 text-sm"
                />
                {form.formState.errors.author && (
                  <p className="mt-1 text-xs text-red-600">{t("reviews.authorError")}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-charcoal/60">
                  {t("reviews.email")}
                </label>
                <input
                  type="email"
                  {...form.register("email")}
                  placeholder={t("reviews.emailPlaceholder")}
                  className="w-full rounded-lg border border-charcoal/15 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-charcoal/60">
                  {t("reviews.text")}
                </label>
                <textarea
                  {...form.register("text")}
                  rows={5}
                  placeholder={t("reviews.textPlaceholder")}
                  className="w-full resize-none rounded-lg border border-charcoal/15 px-3 py-2.5 text-sm"
                />
                {form.formState.errors.text && (
                  <p className="mt-1 text-xs text-red-600">{t("reviews.textError")}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex flex-1 items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("reviews.send")}
              </button>
              <button
                type="button"
                disabled={submitting}
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                {t("reviews.cancel")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
