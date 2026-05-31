"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/data/translations";

export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export type Booking = {
  id: string;
  type: "hotel" | "excursion";
  itemId: string;
  name: string;
  date: string;
  guests: number;
  total: number;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  type: "offer" | "event" | "info";
};

type AppContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  reviews: Review[];
  addReview: (r: Omit<Review, "id" | "date">) => void;
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id">) => void;
  notifications: Notification[];
  pushEnabled: boolean;
  setPushEnabled: (v: boolean) => void;
  offlineReady: boolean;
  syncOffline: () => void;
  user: { name: string; email: string } | null;
  setUser: (u: { name: string; email: string } | null) => void;
  selectedRoute: string | null;
  setSelectedRoute: (id: string | null) => void;
  activePin: string | null;
  setActivePin: (id: string | null) => void;
  toast: (msg: string) => void;
  toastMsg: string | null;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("kk");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tt-lang") as Lang | null;
    if (saved && ["kk", "ru", "en"].includes(saved)) setLangState(saved);
    const savedReviews = localStorage.getItem("tt-app-reviews");
    if (savedReviews) setReviews(JSON.parse(savedReviews));
    const savedBookings = localStorage.getItem("tt-bookings");
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    const savedUser = localStorage.getItem("tt-user");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (localStorage.getItem("tt-offline") === "1") setOfflineReady(true);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("tt-lang", l);
  }, []);

  const translate = useCallback((key: string) => t(lang, key), [lang]);

  const addReview = useCallback((r: Omit<Review, "id" | "date">) => {
    const review: Review = {
      ...r,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
    };
    setReviews((prev) => {
      const next = [review, ...prev];
      localStorage.setItem("tt-app-reviews", JSON.stringify(next));
      return next;
    });
  }, []);

  const addBooking = useCallback((b: Omit<Booking, "id">) => {
    const booking: Booking = { ...b, id: Date.now().toString() };
    setBookings((prev) => {
      const next = [booking, ...prev];
      localStorage.setItem("tt-bookings", JSON.stringify(next));
      return next;
    });
  }, []);

  const syncOffline = useCallback(() => {
    localStorage.setItem(
      "tt-offline",
      JSON.stringify({ pins: true, routes: true, contacts: true, syncedAt: Date.now() })
    );
    setOfflineReady(true);
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("tt-user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (!pushEnabled) return;
    const items: Notification[] = [
      {
        id: "n1",
        title: lang === "kk" ? "20% жеңілдік!" : lang === "ru" ? "Скидка 20%!" : "20% off!",
        body:
          lang === "kk"
            ? "2 күндік турға арналған акция"
            : lang === "ru"
              ? "Акция на 2-дневный тур"
              : "2-day tour promotion",
        type: "offer",
      },
      {
        id: "n2",
        title: lang === "kk" ? "Наурыз фестивалі" : lang === "ru" ? "Фестиваль Наурыз" : "Nauryz Festival",
        body: "2026-06-15",
        type: "event",
      },
    ];
    setNotifications(items);
    toast(
      lang === "kk"
        ? "Push-хабарламалар қосылды!"
        : lang === "ru"
          ? "Push-уведомления включены!"
          : "Push notifications enabled!"
    );
  }, [pushEnabled, lang, toast]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: translate,
      reviews,
      addReview,
      bookings,
      addBooking,
      notifications,
      pushEnabled,
      setPushEnabled,
      offlineReady,
      syncOffline,
      user,
      setUser,
      selectedRoute,
      setSelectedRoute,
      activePin,
      setActivePin,
      toast,
      toastMsg,
    }),
    [
      lang,
      setLang,
      translate,
      reviews,
      addReview,
      bookings,
      addBooking,
      notifications,
      pushEnabled,
      offlineReady,
      syncOffline,
      user,
      selectedRoute,
      activePin,
      toast,
      toastMsg,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
