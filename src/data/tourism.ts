export type MapPin = {
  id: string;
  name: Record<"kk" | "ru" | "en", string>;
  lat: number;
  lng: number;
  type: "sacred" | "museum" | "nature" | "market";
};

export const MAP_PINS: MapPin[] = [
  {
    id: "yasawi",
    name: {
      kk: "Хожа Ахмет Яссауи кесенесі",
      ru: "Мавзолей Ходжи Ахмеда Ясави",
      en: "Khoja Ahmed Yasawi Mausoleum",
    },
    lat: 43.2974,
    lng: 68.2719,
    type: "sacred",
  },
  {
    id: "hazret",
    name: {
      kk: "Әзірет Сұлтан мешіті",
      ru: "Мечеть Әзірет Сұлтан",
      en: "Hazret Sultan Mosque",
    },
    lat: 43.3012,
    lng: 68.2685,
    type: "sacred",
  },
  {
    id: "arystan",
    name: {
      kk: "Арыстан Баб кесенесі",
      ru: "Мавзолей Арыстан Баба",
      en: "Arystan Bab Mausoleum",
    },
    lat: 43.245,
    lng: 68.52,
    type: "sacred",
  },
  {
    id: "museum",
    name: {
      kk: "Яссауи мұражайы",
      ru: "Музей Ясави",
      en: "Yasawi Museum",
    },
    lat: 43.2968,
    lng: 68.2735,
    type: "museum",
  },
  {
    id: "bazaar",
    name: {
      kk: "Түркістан базары",
      ru: "Базар Туркестана",
      en: "Turkestan Bazaar",
    },
    lat: 43.295,
    lng: 68.275,
    type: "market",
  },
];

export const ROUTES = [
  {
    id: "day1",
    duration: { kk: "1 күн", ru: "1 день", en: "1 day" },
    title: {
      kk: "Қасиетті орталық",
      ru: "Священный центр",
      en: "Sacred Center",
    },
    stops: ["yasawi", "museum", "hazret"],
    type: "sacred" as const,
  },
  {
    id: "day2",
    duration: { kk: "2 күн", ru: "2 дня", en: "2 days" },
    title: {
      kk: "Мәдениет + зиярат",
      ru: "Культура + паломничество",
      en: "Culture & Pilgrimage",
    },
    stops: ["yasawi", "arystan", "bazaar"],
    type: "sacred" as const,
  },
  {
    id: "nature",
    duration: { kk: "1 күн", ru: "1 день", en: "1 day" },
    title: {
      kk: "Табиғи маршрут",
      ru: "Природный маршрут",
      en: "Nature Route",
    },
    stops: ["arystan"],
    type: "nature" as const,
  },
];

export const DESTINATIONS = [
  {
    id: "yasawi",
    image:
      "https://images.unsplash.com/photo-1587974922339-957f8180e1da?w=800&q=80",
    tag: "UNESCO",
  },
  {
    id: "karavan",
    image:
      "https://images.unsplash.com/photo-1590073242678-70eeabfc5585?w=800&q=80",
    tag: "History",
  },
  {
    id: "otyrar",
    image:
      "https://images.unsplash.com/photo-1564760055776-d263ef8f40a7?w=800&q=80",
    tag: "Archaeology",
  },
  {
    id: "arystan",
    image:
      "https://images.unsplash.com/photo-1580418821901-f9271fd8dad8?w=800&q=80",
    tag: "Pilgrimage",
  },
];

export const HOTELS = [
  {
    id: "yassawi",
    stars: 4,
    price: 18000,
    rating: 4.8,
  },
  {
    id: "plaza",
    stars: 3,
    price: 12000,
    rating: 4.5,
  },
  {
    id: "silk",
    stars: 3,
    price: 8500,
    rating: 4.6,
  },
];

export const EXCURSIONS = [
  { id: "classic", price: 15000, duration: 4 },
  { id: "full", price: 35000, duration: 16 },
  { id: "vip", price: 52000, duration: 24 },
];

export const QR_OBJECTS = [
  { id: "yasawi", hours: "09:00–19:00" },
  { id: "hazret", hours: "05:00–22:00" },
  { id: "museum", hours: "10:00–18:00" },
];

export const AUDIO_TRACKS = [
  { id: "yasawi", duration: "4:32" },
  { id: "hazret", duration: "3:15" },
  { id: "arystan", duration: "5:10" },
];

export const EVENTS = [
  {
    id: "1",
    date: "2026-06-15",
    title: { kk: "Наурыз фестивалі", ru: "Фестиваль Наурыз", en: "Nauryz Festival" },
  },
  {
    id: "2",
    date: "2026-07-20",
    title: {
      kk: "Жібек жолы форумы",
      ru: "Форум Шёлкового пути",
      en: "Silk Road Forum",
    },
  },
  {
    id: "3",
    date: "2026-08-10",
    title: {
      kk: "Сәулет фестивалі",
      ru: "Фестиваль архитектуры",
      en: "Architecture Festival",
    },
  },
];

export const OFFERS = [
  {
    id: "1",
    discount: 20,
    title: {
      kk: "2 күндік тур — 20% жеңілдік",
      ru: "2-дневный тур — скидка 20%",
      en: "2-day tour — 20% off",
    },
  },
  {
    id: "2",
    discount: 15,
    title: {
      kk: "Қонақ үй + экскурсия пакеті",
      ru: "Пакет отель + экскурсия",
      en: "Hotel + excursion bundle",
    },
  },
];

export const STATS = [
  { key: "visitors", value: 1200000, suffix: "+" },
  { key: "sites", value: 12, suffix: "" },
  { key: "rating", value: 4.9, suffix: "", decimals: 1 },
  { key: "guides", value: 45, suffix: "+" },
];
