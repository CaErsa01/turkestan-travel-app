import type { LocalizedString } from "@/domain/types";
import { TOURIST_ROUTES } from "@/domain/data/places";
import type { Route, RoutePreset, RouteReview } from "../types";
import { ROUTE_COVER_IMAGES } from "./route-images";
import { buildRealisticPricing } from "./route-pricing-data";

const L = (kk: string, ru: string, en: string): LocalizedString => ({ kk, ru, en });

type Meta = {
  category: Route["category"];
  subtitle: LocalizedString;
  shortSummary: LocalizedString;
  transportType: Route["transportType"];
  bookingType: Route["bookingType"];
  rating: number;
  reviewCount: number;
  popularity: number;
  bookingsCount: number;
  relatedRouteIds: string[];
  reviews?: RouteReview[];
  includedExtra?: LocalizedString[];
  accessibilityNotes?: LocalizedString;
};

const META: Record<string, Meta> = {
  "route-1day-sacred": {
    category: "sacred",
    subtitle: L("ЮНЕСКО + мешіт + базар", "ЮНЕСКО + мечеть + базар", "UNESCO + mosque + bazaar"),
    shortSummary: L(
      "Түркістанның қасиетті орталығын 1 күнде",
      "Священный центр Туркестана за 1 день",
      "Sacred heart of Turkestan in one day"
    ),
    transportType: "walking",
    bookingType: "guided",
    rating: 4.9,
    reviewCount: 842,
    popularity: 98,
    bookingsCount: 1240,
    relatedRouteIds: ["route-religious", "route-2day-full"],
    includedExtra: [L("Кәсіби гид", "Профессиональный гид", "Professional guide")],
    reviews: [
      {
        id: "rv-sac-1",
        author: "Айгерим К.",
        rating: 5,
        text: L(
          "Кесене керемет! Гид өте білікті болды.",
          "Мавзолей потрясающий! Гид был очень компетентным.",
          "The mausoleum is stunning! The guide was excellent."
        ),
        createdAt: "2026-04-18",
      },
    ],
  },
  "route-2day-full": {
    category: "culture",
    subtitle: L(
      "Кесене, Арыстан Баб, Keruen Saray",
      "Мавзолей, Арыстан Баб, Keruen Saray",
      "Mausoleum, Arystan Bab, Keruen Saray"
    ),
    shortSummary: L(
      "Толық 2 күндік Түркіstan саяхаты",
      "Полное 2-дневное путешествие по Туркестану",
      "Complete 2-day Turkestan journey"
    ),
    transportType: "mixed",
    bookingType: "guided",
    rating: 4.8,
    reviewCount: 520,
    popularity: 92,
    bookingsCount: 680,
    relatedRouteIds: ["route-1day-sacred", "route-premium"],
    includedExtra: [L("Арыстан Бабқа көлік", "Транспорт до Арыстан Баба", "Transport to Arystan Bab")],
  },
  "route-historical": {
    category: "historical",
    subtitle: L("Отырар + мұражай + кесене", "Отырар + музей + мавзолей", "Otyrar + museum + mausoleum"),
    shortSummary: L("Жібек жолы тарихы", "История Великого шёлкового пути", "Silk Road history trail"),
    transportType: "mixed",
    bookingType: "guided",
    rating: 4.7,
    reviewCount: 310,
    popularity: 85,
    bookingsCount: 420,
    relatedRouteIds: ["route-1day-sacred", "route-family"],
    includedExtra: [L("Отырар археологиялық орталығы", "Археологический центр Отырара", "Otyrar archaeological site")],
  },
  "route-family": {
    category: "family",
    subtitle: L("Мұражай, Keruen, базар", "Музей, Keruen, базар", "Museum, Keruen, bazaar"),
    shortSummary: L("Балаларға ыңғайлы маршрут", "Маршрут для семей с детьми", "Kid-friendly city route"),
    transportType: "walking",
    bookingType: "self-guided",
    rating: 4.6,
    reviewCount: 198,
    popularity: 80,
    bookingsCount: 350,
    relatedRouteIds: ["route-budget", "route-1day-sacred"],
  },
  "route-religious": {
    category: "religious",
    subtitle: L("Зиярат маршруты", "Маршрут паломничества", "Pilgrimage route"),
    shortSummary: L("Қасиетті орындар", "Святые места региона", "Sacred pilgrimage sites"),
    transportType: "mixed",
    bookingType: "guided",
    rating: 4.9,
    reviewCount: 610,
    popularity: 94,
    bookingsCount: 890,
    relatedRouteIds: ["route-1day-sacred", "route-2day-full"],
    includedExtra: [L("Зиярат гиді", "Гид для паломников", "Pilgrimage guide")],
  },
  "route-night": {
    category: "night",
    subtitle: L("Кешкі жарықтандыру", "Вечерняя подсветка", "Evening illumination"),
    shortSummary: L("Кешкі серуен", "Вечерняя прогулка", "Evening walk"),
    transportType: "walking",
    bookingType: "self-guided",
    rating: 4.5,
    reviewCount: 120,
    popularity: 72,
    bookingsCount: 210,
    relatedRouteIds: ["route-1day-sacred", "route-family"],
  },
  "route-budget": {
    category: "budget",
    subtitle: L("Тегін нысандар", "Бесплатные объекты", "Free & affordable sites"),
    shortSummary: L("Ең арзан маршрут", "Самый доступный маршрут", "Most affordable route"),
    transportType: "walking",
    bookingType: "self-guided",
    rating: 4.4,
    reviewCount: 95,
    popularity: 78,
    bookingsCount: 280,
    relatedRouteIds: ["route-family", "route-night"],
  },
};

const PREMIUM_ROUTE: Route = {
  id: "route-premium",
  preset: "premium",
  category: "premium",
  title: L("Premium VIP Түркіstan", "Premium VIP Туркестан", "Premium VIP Turkestan"),
  subtitle: L("VIP гид + қонақ үй + трансфер", "VIP гид + отель + трансфер", "VIP guide + hotel + transfer"),
  description: L(
    "Жеке гид, люкс қонақ үй, трансфер, тамақ және барлық негізгі нысандар.",
    "Частный гид, люкс-отель, трансфер, питание и все ключевые объекты.",
    "Private guide, luxury hotel, transfers, meals and all key sites."
  ),
  shortSummary: L("Толық premium тәжірибе", "Полный premium-опыт", "Full premium experience"),
  coverImage: ROUTE_COVER_IMAGES["route-premium"],
  durationHours: 24,
  totalDistanceKm: 45,
  difficulty: "easy",
  tags: ["premium", "vip", "popular"],
  stops: [
    { placeId: "turkestan-airport", order: 1, durationMin: 60, transportMode: "car", recommendedTime: L("09:00", "09:00", "09:00") },
    { placeId: "yasawi", order: 2, durationMin: 150, transportMode: "walk" },
    { placeId: "hazret", order: 3, durationMin: 90, transportMode: "walk" },
    { placeId: "arystan", order: 4, durationMin: 180, transportMode: "car" },
    { placeId: "hotel-yassawi", order: 5, durationMin: 480, transportMode: "walk" },
    { placeId: "karavan", order: 6, durationMin: 120, transportMode: "walk" },
  ],
  pricing: buildRealisticPricing({
    id: "route-premium",
    durationHours: 24,
    bookingType: "premium",
    stops: [
      { placeId: "turkestan-airport", order: 1, durationMin: 60, transportMode: "car" },
      { placeId: "yasawi", order: 2, durationMin: 150, transportMode: "walk" },
      { placeId: "hazret", order: 3, durationMin: 90, transportMode: "walk" },
      { placeId: "arystan", order: 4, durationMin: 180, transportMode: "car" },
      { placeId: "hotel-yassawi", order: 5, durationMin: 480, transportMode: "walk" },
      { placeId: "karavan", order: 6, durationMin: 120, transportMode: "walk" },
    ],
    preset: "premium",
  }),
  included: [
    L("VIP гид (24 сағ)", "VIP гид (24 ч)", "VIP guide (24h)"),
    L("Трансфер (әуежай–қала)", "Трансфер (аэропорт–город)", "Airport–city transfers"),
    L("Yassawi Hotel 4*", "Yassawi Hotel 4*", "Yassawi Hotel 4*"),
    L("3 мраза / тамақ", "3 приёма пищи", "3 meals"),
  ],
  excluded: [L("Әуе билеті", "Авиабилеты", "Flights")],
  recommendedTimeOfDay: L("09:00–20:00", "09:00–20:00", "09:00–20:00"),
  transportType: "mixed",
  bestSeason: L("Наурыз–қыркүйек", "Март–сентябрь", "March–September"),
  accessibilityNotes: L(
    "VIP көлік, wheelchair сұрау бойынша",
    "VIP транспорт, кресло-коляска по запросу",
    "VIP transport, wheelchair on request"
  ),
  bookingType: "premium",
  rating: 5,
  reviewCount: 89,
  popularity: 88,
  bookingsCount: 156,
  relatedRouteIds: ["route-2day-full", "route-religious"],
  reviews: [
    {
      id: "pr1",
      author: "Aigerim K.",
      rating: 5,
      text: L("Керемет VIP қызмет!", "Отличный VIP-сервис!", "Excellent VIP service!"),
      createdAt: "2026-04-12",
    },
  ],
  availability: genAvailability(21),
};

function genAvailability(days: number) {
  const out: { date: string; slots: number }[] = [];
  const base = new Date();
  for (let i = 1; i <= days; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    out.push({ date: d.toISOString().split("T")[0], slots: Math.floor(Math.random() * 6) + 2 });
  }
  return out;
}

const SHARED = {
  included: [
    L("Маршрут картасы", "Карта маршрута", "Route map"),
    L("Нысан координаттары", "Координаты объектов", "Site coordinates"),
  ],
  excluded: [L("Жеке шығындар", "Личные расходы", "Personal expenses")],
  recommendedTimeOfDay: L("09:00–18:00", "09:00–18:00", "09:00–18:00"),
  bestSeason: L("Наурыз–қыркүйек", "Март–сентябрь", "March–September"),
  accessibilityNotes: L(
    "Көбіне жаяу, кейбір нысандарда basamak",
    "В основном пешком, на некоторых объектах есть ступени",
    "Mostly walking, some steps at certain sites"
  ),
};

function presetToCategory(preset: RoutePreset): Route["category"] {
  if (preset === "1-day" || preset === "2-day") return "sacred";
  return preset as Route["category"];
}

function buildFromTourist(): Route[] {
  return TOURIST_ROUTES.map((tr) => {
    const meta = META[tr.id];
    const category = meta?.category ?? presetToCategory(tr.preset as RoutePreset);
    const bookingType = meta?.bookingType ?? "self-guided";
    const stops = tr.stops.map((s) => ({ ...s }));

    return {
      id: tr.id,
      preset: tr.preset as RoutePreset,
      category,
      title: tr.title,
      subtitle: meta?.subtitle ?? tr.description,
      description: tr.description,
      shortSummary: meta?.shortSummary ?? tr.description,
      coverImage: ROUTE_COVER_IMAGES[tr.id] ?? ROUTE_COVER_IMAGES["route-1day-sacred"],
      durationHours: tr.durationHours,
      totalDistanceKm: tr.totalWalkKm,
      difficulty: tr.difficulty,
      tags: tr.tags,
      stops,
      pricing: buildRealisticPricing({
        id: tr.id,
        durationHours: tr.durationHours,
        bookingType,
        stops,
        preset: tr.preset,
      }),
      included: [...SHARED.included, ...(meta?.includedExtra ?? [])],
      excluded: [...SHARED.excluded],
      recommendedTimeOfDay: SHARED.recommendedTimeOfDay,
      transportType: meta?.transportType ?? "walking",
      bestSeason: SHARED.bestSeason,
      accessibilityNotes: meta?.accessibilityNotes ?? SHARED.accessibilityNotes,
      bookingType,
      rating: meta?.rating ?? 4.5,
      reviewCount: meta?.reviewCount ?? 50,
      popularity: meta?.popularity ?? 70,
      bookingsCount: meta?.bookingsCount ?? 100,
      relatedRouteIds: meta?.relatedRouteIds ?? [],
      reviews: meta?.reviews ?? [
        {
          id: `rv-${tr.id}`,
          author: "Guest",
          rating: meta?.rating ?? 4.5,
          text: L("Керемет маршрут!", "Отличный маршрут!", "Great route!"),
          createdAt: "2026-05-01",
        },
      ],
      availability: genAvailability(14),
    } satisfies Route;
  });
}

export const TOUR_ROUTES: Route[] = [...buildFromTourist(), PREMIUM_ROUTE];

export function getTourRouteById(id: string): Route | undefined {
  return TOUR_ROUTES.find((r) => r.id === id);
}

export function getRouteStopIds(route: Route): string[] {
  return [...route.stops].sort((a, b) => a.order - b.order).map((s) => s.placeId);
}

export function getRouteTitle(route: Route, locale: "kk" | "ru" | "en"): string {
  return route.title[locale];
}
