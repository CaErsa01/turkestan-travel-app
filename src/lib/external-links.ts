import type { LocalizedString } from "@/domain/types";

/** Deep links — Turkestan / Shymkent (nearest airport) */
export const TURKESTAN_BOOKING_SEARCH =
  "https://www.booking.com/searchresults.html?ss=Turkestan%2C+Kazakhstan";

export type BookingCategory = "hotels" | "apartments" | "flights" | "tours";

export type BookingPartner = {
  id: string;
  name: string;
  description: LocalizedString;
  url: string;
  color: string;
  category: BookingCategory;
  region: "global" | "kz" | "cis";
};

const L = (kk: string, ru: string, en: string): LocalizedString => ({ kk, ru, en });

/** Verified partner links (2026) — opens in new tab */
export const BOOKING_PARTNERS: BookingPartner[] = [
  // ——— Hotels ———
  {
    id: "booking",
    name: "Booking.com",
    description: L("Қонақ үйлер — Түркістан", "Отели в Туркестане", "Hotels in Turkestan"),
    url: TURKESTAN_BOOKING_SEARCH,
    color: "#003580",
    category: "hotels",
    region: "global",
  },
  {
    id: "ostrovok",
    name: "Ostrovok",
    description: L(
      "Rixos, Hilton, Karavan Saray",
      "Rixos, Hilton, Karavan Saray",
      "Rixos, Hilton, Karavan Saray"
    ),
    url: "https://ostrovok.ru/hotel/kazakhstan/turkestan/",
    color: "#FF5722",
    category: "hotels",
    region: "cis",
  },
  {
    id: "yandex-travel",
    name: "Яндекс Путешествия",
    description: L("Қонақ үй + кешбэк", "Отели + кешбэк", "Hotels + cashback"),
    url: "https://travel.yandex.ru/hotels/turkestan/",
    color: "#FC3F1D",
    category: "hotels",
    region: "cis",
  },
  {
    id: "agoda",
    name: "Agoda",
    description: L("Халықаралық платформа", "Международная платформа", "International platform"),
    url: "https://www.agoda.com/city/turkestan-kz.html",
    color: "#5542F6",
    category: "hotels",
    region: "global",
  },

  // ——— Apartments (KZ focus) ———
  {
    id: "krisha",
    name: "Krisha.kz",
    description: L(
      "Пәтер посуточно — Түркістан",
      "Квартиры посуточно — Туркестан",
      "Daily rentals — Turkestan"
    ),
    url: "https://krisha.kz/arenda/kvartiry-posutochno/turkestan/",
    color: "#FF6B00",
    category: "apartments",
    region: "kz",
  },
  {
    id: "olx",
    name: "OLX.kz",
    description: L(
      "Пәтер / үй — хабарландырулар",
      "Квартиры / дома — объявления",
      "Apartments & houses — listings"
    ),
    url: "https://www.olx.kz/nedvizhimost/arenda-pochasovo-posutochno/kvartiry/turkestan/",
    color: "#002F34",
    category: "apartments",
    region: "kz",
  },
  {
    id: "airbnb",
    name: "Airbnb",
    description: L("Жеке пәтерлер", "Частное жильё", "Private stays"),
    url: "https://www.airbnb.com/s/Turkestan--Kazakhstan/homes",
    color: "#FF5A5F",
    category: "apartments",
    region: "global",
  },

  // ——— Flights (→ Shymkent, ~160 km) ———
  {
    id: "aviata",
    name: "Aviata.kz",
    description: L(
      "Әуе билет — Қазақстан",
      "Авиабилеты — Казахстан",
      "Flights — Kazakhstan"
    ),
    url: "https://aviata.kz/flights/almaty-to-shymkent",
    color: "#00A651",
    category: "flights",
    region: "kz",
  },
  {
    id: "kaspi-travel",
    name: "Kaspi Travel",
    description: L(
      "Авиа, ЖД, тур — Kaspi.kz",
      "Авиа, ЖД, туры — Kaspi.kz",
      "Flights, rail, tours — Kaspi.kz"
    ),
    url: "https://travel.kaspi.kz/",
    color: "#F14635",
    category: "flights",
    region: "kz",
  },
  {
    id: "airastana",
    name: "Air Astana",
    description: L("Шымкентке рейстер", "Рейсы в Шымкент", "Flights to Shymkent"),
    url: "https://airastana.com/kaz-en/",
    color: "#8B1538",
    category: "flights",
    region: "kz",
  },
  {
    id: "skyscanner",
    name: "Skyscanner",
    description: L("Шымкент (CIT) — салыстыру", "Шымкент (CIT) — сравнение", "Shymkent (CIT) — compare"),
    url: "https://www.skyscanner.com/transport/flights-to/cita/",
    color: "#0770E3",
    category: "flights",
    region: "global",
  },

  // ——— Tours & info ———
  {
    id: "tripadvisor",
    name: "Tripadvisor",
    description: L("Пікірлер + идеялар", "Отзывы + идеи", "Reviews + ideas"),
    url: "https://www.tripadvisor.com/Tourism-g424943-Turkestan_Turkistan_Region-Vacations.html",
    color: "#34E0A1",
    category: "tours",
    region: "global",
  },
  {
    id: "trip",
    name: "Trip.com",
    description: L("Тур paketтері", "Турпакеты", "Tour packages"),
    url: "https://www.trip.com/travel-guide/destination/turkestan-150000/",
    color: "#287DFA",
    category: "tours",
    region: "global",
  },
  {
    id: "2gis",
    name: "2GIS",
    description: L("Қонақ үйлер картада", "Отели на карте", "Hotels on map"),
    url: "https://2gis.kz/turkestan/search/Гостиницы",
    color: "#3ECE7E",
    category: "tours",
    region: "kz",
  },
];

export const BOOKING_CATEGORIES: BookingCategory[] = [
  "hotels",
  "apartments",
  "flights",
  "tours",
];

export function getPartnersByCategory(category: BookingCategory): BookingPartner[] {
  return BOOKING_PARTNERS.filter((p) => p.category === category);
}

export const TRANSPORT_LINKS = [
  {
    name: "Google Maps",
    url: "https://www.google.com/maps/search/Turkestan,+Kazakhstan",
  },
  {
    name: "2GIS",
    url: "https://2gis.kz/turkestan",
  },
] as const;
