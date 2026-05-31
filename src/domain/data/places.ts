import type {
  Place,
  AudioTrack,
  TouristRoute,
  BookingListing,
  QrContent,
  OfficialInfo,
  LocalizedString,
  Locale,
} from "@/domain/types";
import { placeImageUrl } from "@/lib/images";

const L = (kk: string, ru: string, en: string) => ({ kk, ru, en });

export const PLACES: Place[] = [
  {
    id: "yasawi",
    name: L(
      "Хожа Ахмет Яссауи кесенесі",
      "Мавзолей Ходжи Ахмеда Ясави",
      "Khoja Ahmed Yasawi Mausoleum"
    ),
    description: L(
      "XIV ғасырдағы сәулет шедеврі. ЮНЕСКО әлемдік мұрасы, Түркі әлемінің рухани орталығы.",
      "Архитектурный шедевр XIV века, объект Всемирного наследия ЮНЕСКО.",
      "14th-century UNESCO World Heritage site and spiritual heart of the Turkic world."
    ),
    category: "sacred",
    latitude: 43.2974,
    longitude: 68.2719,
    images: [
      "https://images.unsplash.com/photo-1587974922339-957f8180e1da?w=1200&q=80",
      "https://images.unsplash.com/photo-1590073242678-70eeabfc5585?w=1200&q=80",
    ],
    rating: 4.9,
    openingHours: L("09:00–19:00", "09:00–19:00", "09:00–19:00"),
    qrCode: "yasawi",
    audioGuide: ["yasawi-intro", "yasawi-history"],
  },
  {
    id: "otyrar",
    name: L("Отырар қаласы", "Город Отырар", "Otyrar Ancient City"),
    description: L(
      "Жібек жолы бойындағы ежелгі қала. Ежелгі түркі өркениетінің орталығы.",
      "Древний город на Великом шёлковом пути.",
      "Ancient Silk Road city and center of Turkic civilization."
    ),
    category: "historical",
    latitude: 42.8533,
    longitude: 68.3033,
    images: ["https://images.unsplash.com/photo-1564760055776-d263ef8f40a7?w=1200&q=80"],
    rating: 4.7,
    openingHours: L("10:00–17:00", "10:00–17:00", "10:00–17:00"),
    qrCode: "otyrar",
    audioGuide: ["otyrar-intro"],
  },
  {
    id: "arystan",
    name: L("Арыстан Баб кесенесі", "Мавзолей Арыстан Баба", "Arystan Bab Mausoleum"),
    description: L(
      "Яссауи бабасының рухани мұрағасы. Қасиетті зиярат орны.",
      "Духовное наследие Ясави. Важное место паломничества.",
      "Spiritual legacy of Yasawi. Key pilgrimage destination."
    ),
    category: "sacred",
    latitude: 43.245,
    longitude: 68.52,
    images: ["https://images.unsplash.com/photo-1580418821901-f9271fd8dad8?w=1200&q=80"],
    rating: 4.8,
    openingHours: L("08:00–18:00", "08:00–18:00", "08:00–18:00"),
    qrCode: "arystan",
    audioGuide: ["arystan-intro", "arystan-history"],
  },
  {
    id: "hazret",
    name: L("Әзірет Сұлтан мешіті", "Мечеть Әзірет Сұлтан", "Hazret Sultan Mosque"),
    description: L(
      "Заманауи ислам сәулеті мен дәстүрлі өнердің үйлесімі. Қазақстанның ең үлкен мешіті.",
      "Сочетание современной исламской архитектуры и традиций.",
      "Largest mosque in Kazakhstan — modern Islamic architecture."
    ),
    category: "sacred",
    latitude: 43.3012,
    longitude: 68.2685,
    images: ["https://images.unsplash.com/photo-1580619303291-c75199a066db?w=1200&q=80"],
    rating: 4.9,
    openingHours: L("05:00–22:00", "05:00–22:00", "05:00–22:00"),
    qrCode: "hazret",
    audioGuide: ["hazret-intro"],
  },
  {
    id: "museum",
    name: L("Яссауи мұражайы", "Музей Ясави", "Yasawi Museum"),
    description: L(
      "Кесене тарихы мен Түркістан мәдениеті. Тарихи экспонаттар мен артефактылар.",
      "История мавзолея и культуры Туркестана.",
      "Mausoleum history and regional culture exhibits."
    ),
    category: "museum",
    latitude: 43.2968,
    longitude: 68.2735,
    images: ["https://images.unsplash.com/photo-1566127443-0d2c2c8f2b0e?w=1200&q=80"],
    rating: 4.6,
    openingHours: L("10:00–18:00", "10:00–18:00", "10:00–18:00"),
    qrCode: "museum",
    audioGuide: ["museum-intro"],
  },
  {
    id: "karavan",
    name: L("Керuen Saray", "Keruen Saray", "Keruen Saray Complex"),
    description: L(
      "Дүкендер, мейрамханалар, мәдени орталық. Заманауи туризм кешені.",
      "Shops, restaurants, cultural hub.",
      "Modern tourism complex with shops, restaurants, and cultural events."
    ),
    category: "market",
    latitude: 43.294,
    longitude: 68.276,
    images: ["https://images.unsplash.com/photo-1441986300917-64676bd600d8?w=1200&q=80"],
    rating: 4.5,
    openingHours: L("10:00–22:00", "10:00–22:00", "10:00–22:00"),
    qrCode: "karavan",
    audioGuide: [],
  },
  {
    id: "bazaar",
    name: L("Түркістан базары", "Базар Туркестана", "Turkestan Bazaar"),
    description: L(
      "Бешбармақ, наурыз көже және ұлттық сувенирлер. Дәстүрлі тағамдар мен қолөнер.",
      "Национальная кухня и сувениры.",
      "Traditional food, crafts, and national souvenirs."
    ),
    category: "market",
    latitude: 43.295,
    longitude: 68.275,
    images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80"],
    rating: 4.4,
    openingHours: L("08:00–20:00", "08:00–20:00", "08:00–20:00"),
    qrCode: "bazaar",
    audioGuide: [],
  },
  {
    id: "hotel-yassawi",
    name: L("Yassawi Hotel", "Отель Yassawi", "Yassawi Hotel"),
    description: L(
      "Таңғы ас, Wi-Fi, экскурсия бюросы. Кесенеге жақын 4 жұлдызды қонақ үй.",
      "Завтрак, Wi-Fi, экскурсионное бюро. 4 звезды у мавзолея.",
      "4-star hotel near the mausoleum with breakfast, Wi-Fi, and tour desk."
    ),
    category: "hotel",
    latitude: 43.298,
    longitude: 68.272,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80"],
    rating: 4.8,
    openingHours: L("24/7", "24/7", "24/7"),
    qrCode: null,
    audioGuide: [],
  },
  {
    id: "restaurant-dastarkhan",
    name: L("Дастархан мейрамханасы", "Ресторан Дастархан", "Dastarkhan Restaurant"),
    description: L(
      "Бешбармақ, палау, шай. Ұлттық тағамдар.",
      "Бешбармак, плов, чай. Национальная кухня.",
      "National cuisine — beshbarmak, pilaf, and tea."
    ),
    category: "restaurant",
    latitude: 43.296,
    longitude: 68.274,
    images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80"],
    rating: 4.6,
    openingHours: L("11:00–23:00", "11:00–23:00", "11:00–23:00"),
    qrCode: null,
    audioGuide: [],
  },
  {
    id: "station",
    name: L("Түркістан вокзалы", "Вокзал Туркестан", "Turkestan Railway Station"),
    description: L(
      "Шымкент, Алматы бағыты. Қалааралық көлік.",
      "Направления Шымкент, Алматы.",
      "Intercity rail hub with routes to Shymkent and Almaty."
    ),
    category: "transport",
    latitude: 43.31,
    longitude: 68.28,
    images: ["https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&q=80"],
    rating: 4.2,
    openingHours: L("24/7", "24/7", "24/7"),
    qrCode: null,
    audioGuide: [],
  },
  {
    id: "turkestan-airport",
    name: L(
      "Түркістан халықаралық әуежайы",
      "Международный аэропорт Туркестан",
      "Turkistan International Airport"
    ),
    description: L(
      "Түркістан мен оңтүстік өңірге әуе қатынасы. Hazrat Sultan International Airport (HSA).",
      "Воздушные ворота Туркестана и южного региона.",
      "Hazrat Sultan International Airport — air gateway to Turkestan."
    ),
    category: "transport",
    latitude: 43.3136,
    longitude: 68.5703,
    images: ["https://images.unsplash.com/photo-1436491865339-9a61a109cc05?w=1200&q=80"],
    rating: 4.3,
    openingHours: L("24/7", "24/7", "24/7"),
    qrCode: null,
    audioGuide: [],
  },
  {
    id: "nauryz-fest",
    name: L("Наурыз фестивалі", "Фестиваль Наурыз", "Nauryz Festival"),
    description: L(
      "Наурыз мерекесі. Мәдени іс-шара.",
      "Празднование Наурыз.",
      "Nauryz cultural celebration and festival."
    ),
    category: "event",
    latitude: 43.298,
    longitude: 68.27,
    images: ["https://images.unsplash.com/photo-1533174072545-7a4b6ecd7bae?w=1200&q=80"],
    rating: 4.9,
    openingHours: L("2026-03-22", "2026-03-22", "2026-03-22"),
    qrCode: "nauryz-fest",
    audioGuide: [],
  },
];

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: "yasawi-intro",
    placeId: "yasawi",
    type: "intro",
    title: L("Кесенеге кіріспе", "Введение", "Introduction"),
    durationSec: 272,
    transcript: L("Хожа Ахмет Яссауи...", "Ходжа Ахмет Ясави...", "Khoja Ahmed Yasawi..."),
    locale: "kk",
  },
  {
    id: "yasawi-history",
    placeId: "yasawi",
    type: "history",
    title: L("Тарихи түсіндірме", "Исторический рассказ", "Historical narrative"),
    durationSec: 480,
    transcript: L("XIV ғасыр...", "XIV век...", "14th century..."),
    locale: "kk",
  },
  {
    id: "arystan-intro",
    placeId: "arystan",
    type: "intro",
    title: L("Арыстан Баб", "Арыстан Баб", "Arystan Bab"),
    durationSec: 190,
    transcript: L("...", "...", "..."),
    locale: "kk",
  },
  {
    id: "arystan-history",
    placeId: "arystan",
    type: "history",
    title: L("Зиярат тарихы", "История паломничества", "Pilgrimage history"),
    durationSec: 310,
    transcript: L("...", "...", "..."),
    locale: "ru",
  },
  {
    id: "hazret-intro",
    placeId: "hazret",
    type: "intro",
    title: L("Мешіт туралы", "О мечети", "About the mosque"),
    durationSec: 195,
    transcript: L("...", "...", "..."),
    locale: "kk",
  },
  {
    id: "museum-intro",
    placeId: "museum",
    type: "intro",
    title: L("Мұражай", "Музей", "Museum"),
    durationSec: 150,
    transcript: L("...", "...", "..."),
    locale: "en",
  },
  {
    id: "otyrar-intro",
    placeId: "otyrar",
    type: "history",
    title: L("Отырар", "Отырар", "Otyrar"),
    durationSec: 240,
    transcript: L("...", "...", "..."),
    locale: "kk",
  },
];

export const TOURIST_ROUTES: TouristRoute[] = [
  {
    id: "route-1day-sacred",
    preset: "1-day",
    title: L("1 күн — Қасиетті орталық", "1 день — Священный центр", "1 day — Sacred center"),
    description: L("Негізгі қасиетті нысандар", "Основные священные объекты", "Main sacred sites"),
    durationHours: 8,
    totalWalkKm: 4.2,
    difficulty: "easy",
    tags: ["sacred", "popular"],
    stops: [
      { placeId: "yasawi", order: 1, durationMin: 120, transportMode: "walk" },
      { placeId: "museum", order: 2, durationMin: 60, transportMode: "walk" },
      { placeId: "hazret", order: 3, durationMin: 45, transportMode: "walk" },
      { placeId: "bazaar", order: 4, durationMin: 90, transportMode: "walk" },
    ],
  },
  {
    id: "route-2day-full",
    preset: "2-day",
    title: L("2 күн — Толық Түркістан", "2 дня — Полный Туркестан", "2 days — Full Turkestan"),
    description: L("Кесене + Арыстан Баб + базар", "Мавзолей + Арыстан Баб + базар", "Mausoleum + Arystan + bazaar"),
    durationHours: 16,
    totalWalkKm: 8,
    difficulty: "moderate",
    tags: ["culture", "pilgrimage"],
    stops: [
      { placeId: "yasawi", order: 1, durationMin: 120, transportMode: "walk" },
      { placeId: "hazret", order: 2, durationMin: 60, transportMode: "walk" },
      { placeId: "arystan", order: 3, durationMin: 180, transportMode: "car" },
      { placeId: "karavan", order: 4, durationMin: 90, transportMode: "walk" },
    ],
  },
  {
    id: "route-historical",
    preset: "historical",
    title: L("Тарихи маршрут", "Исторический маршрут", "Historical route"),
    description: L("Отырар және мұражай", "Отырар и музей", "Otyrar and museum"),
    durationHours: 10,
    totalWalkKm: 2,
    difficulty: "moderate",
    tags: ["historical"],
    stops: [
      { placeId: "museum", order: 1, durationMin: 90, transportMode: "walk" },
      { placeId: "yasawi", order: 2, durationMin: 120, transportMode: "walk" },
      { placeId: "otyrar", order: 3, durationMin: 240, transportMode: "car" },
    ],
  },
  {
    id: "route-family",
    preset: "family",
    title: L("Отбасылық маршрут", "Семейный маршрут", "Family route"),
    description: L("Жеңіл және қызықты", "Easy and engaging", "Easy and engaging"),
    durationHours: 6,
    totalWalkKm: 3,
    difficulty: "easy",
    tags: ["family"],
    stops: [
      { placeId: "museum", order: 1, durationMin: 60, transportMode: "walk" },
      { placeId: "karavan", order: 2, durationMin: 120, transportMode: "walk" },
      { placeId: "bazaar", order: 3, durationMin: 90, transportMode: "walk" },
    ],
  },
  {
    id: "route-religious",
    preset: "religious",
    title: L("Діни зиярат", "Религиозный маршрут", "Religious pilgrimage"),
    description: L("Қасиетті орындар", "Sacred places", "Sacred places"),
    durationHours: 12,
    totalWalkKm: 5,
    difficulty: "moderate",
    tags: ["sacred", "religious"],
    stops: [
      { placeId: "hazret", order: 1, durationMin: 60, transportMode: "walk" },
      { placeId: "yasawi", order: 2, durationMin: 150, transportMode: "walk" },
      { placeId: "arystan", order: 3, durationMin: 180, transportMode: "car" },
    ],
  },
  {
    id: "route-night",
    preset: "night",
    title: L("Түнгі серуен", "Вечерний маршрут", "Evening route"),
    description: L("Жарықтандырылған нысандар", "Illuminated sites", "Illuminated sites"),
    durationHours: 4,
    totalWalkKm: 2.5,
    difficulty: "easy",
    tags: ["night"],
    stops: [
      { placeId: "hazret", order: 1, durationMin: 45, transportMode: "walk" },
      { placeId: "karavan", order: 2, durationMin: 120, transportMode: "walk" },
    ],
  },
  {
    id: "route-budget",
    preset: "budget",
    title: L("Бюджеттік маршрут", "Бюджетный маршрут", "Budget route"),
    description: L("Тегін және арзан", "Free and affordable", "Free and affordable"),
    durationHours: 5,
    totalWalkKm: 4,
    difficulty: "easy",
    tags: ["budget"],
    stops: [
      { placeId: "hazret", order: 1, durationMin: 45, transportMode: "walk" },
      { placeId: "bazaar", order: 2, durationMin: 120, transportMode: "walk" },
    ],
  },
];

export const BOOKING_LISTINGS: BookingListing[] = [
  {
    id: "hotel-yassawi-book",
    type: "hotel",
    name: L("Yassawi Hotel", "Отель Yassawi", "Yassawi Hotel"),
    description: L("4 жұлдыз, кесенеге 5 мин", "4 звезды, 5 мин до мавзолея", "4-star, 5 min to mausoleum"),
    pricePerNight: 18000,
    rating: 4.8,
    reviewCount: 312,
    location: L("Түркістан, кесене жаны", "Туркестан, у мавзолея", "Turkestan, near mausoleum"),
    lat: 43.298,
    lng: 68.272,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"],
    amenities: [L("Wi-Fi", "Wi-Fi", "Wi-Fi"), L("Таңғы ас", "Завтрак", "Breakfast")],
    cancellationPolicy: L("24 сағат бұрын тегін", "Бесплатно за 24 ч", "Free 24h before"),
    includedServices: [L("Таңғы ас", "Завтрак", "Breakfast")],
    availability: generateAvailability(14),
  },
  {
    id: "hotel-plaza",
    type: "hotel",
    name: L("Turkestan Plaza", "Turkestan Plaza", "Turkestan Plaza"),
    description: L("3 жұлдыз, орталық", "3 звезды, центр", "3-star, central"),
    pricePerNight: 12000,
    rating: 4.5,
    reviewCount: 198,
    location: L("Орталық", "Центр", "City center"),
    lat: 43.295,
    lng: 68.275,
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"],
    amenities: [L("Тұрақ", "Парковка", "Parking")],
    cancellationPolicy: L("48 сағат бұрын", "За 48 ч", "48h before"),
    includedServices: [],
    availability: generateAvailability(14),
  },
  {
    id: "exc-classic",
    type: "excursion",
    name: L("Классикалық экскурсия", "Классическая экскурсия", "Classic tour"),
    description: L("4 сағат, гидпен", "4 часа с гидом", "4 hours with guide"),
    pricePerPerson: 15000,
    durationHours: 4,
    rating: 4.9,
    reviewCount: 456,
    location: L("Кесене алаңы", "Площадь мавзолея", "Mausoleum square"),
    lat: 43.297,
    lng: 68.272,
    images: ["https://images.unsplash.com/photo-1526778548025-fa2faacdce40?w=800&q=80"],
    amenities: [],
    cancellationPolicy: L("24 сағат", "24 часа", "24 hours"),
    includedServices: [L("Гид", "Гид", "Guide")],
    availability: generateAvailability(30),
  },
  {
    id: "exc-vip",
    type: "excursion",
    name: L("VIP тур", "VIP тур", "VIP tour"),
    description: L("Толық күн", "Полный день", "Full day"),
    pricePerPerson: 52000,
    durationHours: 10,
    rating: 5,
    reviewCount: 89,
    location: L("Түркістан", "Туркестан", "Turkestan"),
    lat: 43.297,
    lng: 68.272,
    images: ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"],
    amenities: [],
    cancellationPolicy: L("72 сағат", "72 часа", "72 hours"),
    includedServices: [L("Көлік", "Транспорт", "Transport"), L("Тамақ", "Питание", "Meals")],
    availability: generateAvailability(30),
  },
  {
    id: "guide-english",
    type: "guide",
    name: L("Ағылшын тілді гид", "Гид (англ.)", "English guide"),
    description: L("Жеке гид", "Персональный гид", "Private guide"),
    pricePerPerson: 25000,
    durationHours: 3,
    rating: 4.9,
    reviewCount: 67,
    location: L("Түркістан", "Туркестан", "Turkestan"),
    lat: 43.297,
    lng: 68.272,
    images: ["https://images.unsplash.com/photo-1526778548025-fa2faacdce40?w=800&q=80"],
    amenities: [],
    cancellationPolicy: L("24 сағат", "24 hours", "24 hours"),
    includedServices: [L("Аудио жабдық", "Аудио", "Audio equipment")],
    availability: generateAvailability(21),
  },
];

for (const p of PLACES) {
  p.images = [placeImageUrl(p.id)];
}
for (const b of BOOKING_LISTINGS) {
  b.images = [placeImageUrl(b.id)];
}

function generateAvailability(days: number) {
  const out: { date: string; slots: number }[] = [];
  const base = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    out.push({
      date: d.toISOString().split("T")[0],
      slots: Math.floor(Math.random() * 8) + 2,
    });
  }
  return out;
}

const QR_HISTORY: Record<string, LocalizedString> = {
  yasawi: L(
    "1389 жылы Әmir Temir тапсырmasıмен салынған кесене — Тимурид сәулетінің шедеврі. Хожа Ахмет Яссауи XII ғасырда өмір сүрген суfi ақын әрі діни қайраткер. ЮНЕСКО әлемдік мұрасы (2003).",
    "Мавзолей построен по заказу Тимура в 1389 году — шедевр timuridской архитектуры. Ходжа Ахмет Ясави — поэт и суфий XII века. Объект ЮНЕСКО с 2003 года.",
    "Commissioned by Timur in 1389, this mausoleum is a masterpiece of Timurid architecture honoring the 12th-century Sufi poet Khoja Ahmed Yasawi. UNESCO World Heritage since 2003."
  ),
  otyrar: L(
    "Отырар — Жібек жолы бойындағы ежелгі қала. XII–XIII ғасырларда сауда мен ғылым орталығы. Моңғол шапқыншылығы кезінде қала қираған.",
    "Отырар — древний город на Великом шёлковом пути. В XII–XIII вв. центр торговли и науки. Разрушен во время нашествия монголов.",
    "Otyrar was a major Silk Road city and center of learning in the 12th–13th centuries, destroyed during the Mongol invasion."
  ),
  arystan: L(
    "Арыстан Баб — Хожа Ахмет Яссауидің рухани шәкірті. Кесене XII ғасырда салынған, зияратшылар Түркістанға бармас бұрын осында алады.",
    "Арыстан Баб — духовный ученик Ходжи Ахмеда Ясави. Мавзолей XII века; паломники посещают его перед поездкой в Туркестан.",
    "Arystan Bab was a spiritual disciple of Khoja Ahmed Yasawi. The 12th-century mausoleum is visited by pilgrims before Turkestan."
  ),
  hazret: L(
    "2012 жылы ашылған Әзірет Сultan мешіті — Қазақстанның ең үлкен мешіті. Түркістанның заманауи рухани символы.",
    "Мечеть Әзірет Сultan открыта в 2012 году — крупнейшая в Казахстане. Современный духовный символ Туркестана.",
    "Opened in 2012, Hazret Sultan Mosque is the largest in Kazakhstan and a modern spiritual landmark of Turkestan."
  ),
  museum: L(
    "Мұражайда кесене тарихы, археологиялық табылғылар және Түркістан мәдениеті көрсетілген.",
    "Музей представляет историю мавзолея, археологические находки и культуру Туркестана.",
    "The museum exhibits mausoleum history, archaeological finds, and Turkestan regional culture."
  ),
  karavan: L(
    "Керuen Saray — дүкендер, мейрамханалар және мәдени орталықтан тұратын заманауи туризм кешені.",
    "Keruen Saray — современный туристический комплекс с магазинами, ресторанами и культурным центром.",
    "Keruen Saray is a modern tourism complex with shops, restaurants, and a cultural center."
  ),
  bazaar: L(
    "Дәстүрлі базар — ұлттық тағамдар, қолөнер бұйымдары және сувенирлер.",
    "Традиционный базар — национальная кухня, ремёсла и сувениры.",
    "Traditional bazaar offering national food, crafts, and souvenirs."
  ),
  "nauryz-fest": L(
    "Наурыз — көктем мерекесі. Түркістанда концерт, этно-фестиваль және ұлттық ойындар өтеді.",
    "Наурыз — весенний праздник. В Туркестане проходят концерты, этнофестивали и национальные игры.",
    "Nauryz spring festival with concerts, ethno-festivals, and national games in Turkestan."
  ),
};

export const QR_CONTENT: Record<string, QrContent> = Object.fromEntries(
  PLACES.filter((p) => p.qrCode).map((p) => [
    p.id,
    {
      placeId: p.id,
      summary: p.description,
      history: QR_HISTORY[p.id] ?? p.description,
      gallery: p.images,
      audioGuide: p.audioGuide,
    },
  ])
);

export const OFFICIAL_INFO: OfficialInfo[] = [
  {
    id: "hours-general",
    category: "hours",
    title: L("Жалпы жұмыс уақыты", "Общие часы работы", "General opening hours"),
    body: L(
      "Негізгі нысандар 09:00–19:00. Мешіт 05:00–22:00.",
      "Основные объекты 09:00–19:00. Мечеть 05:00–22:00.",
      "Main sites 09:00–19:00. Mosque 05:00–22:00."
    ),
    source: L("Түркістан әкімдігі", "Акимат Туркестана", "Turkestan Akimat"),
    lastUpdated: "2026-05-01",
  },
  {
    id: "transport",
    category: "transport",
    title: L("Көлік", "Транспорт", "Transport"),
    body: L(
      "Шымкенттен автобус №12, №45. Вокзал — қала орталығы 15 мин.",
      "Из Шымкента автобусы №12, №45. Вокзал — центр 15 мин.",
      "From Shymkent buses #12, #45. Station to center 15 min."
    ),
    source: L("ҚТЖ", "КТЖ", "KTZ"),
    lastUpdated: "2026-04-15",
  },
  {
    id: "safety",
    category: "safety",
    title: L("Қауіпсіздік", "Безопасность", "Safety"),
    body: L(
      "Қала қонақжайлы және қауіпсіз. Жедел көмек: 112.",
      "Город гостеприимный и безопасный. Экстренная помощь: 112.",
      "City is hospitable and safe. Emergency: 112."
    ),
    source: L("Туризм департаменті", "Департамент туризма", "Tourism department"),
    lastUpdated: "2026-05-20",
  },
  {
    id: "weather",
    category: "weather",
    title: L("Климат", "Климат", "Climate"),
    body: L(
      "Мамыр–қыркүйек: жылы. Қыс: суық, 0°C–5°C.",
      "Май–сентябрь: тепло. Зима: холодно, 0°C–5°C.",
      "May–September: warm. Winter: cold, 0°C–5°C."
    ),
    source: L("ҚМДБ", "Метеослужба", "Weather service"),
    lastUpdated: "2026-05-25",
  },
];

export const DEFAULT_REVIEWS: {
  id: string;
  placeId: string;
  author: string;
  rating: number;
  text: string;
  helpful: number;
  createdAt: string;
  verified?: boolean;
}[] = [];

export function getPlaceById(id: string) {
  return PLACES.find((p) => p.id === id);
}

export function getLocalized(obj: LocalizedString, locale: Locale): string {
  return obj[locale] ?? obj.kk;
}
