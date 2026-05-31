# Turkistan Travel App

Production-ready smart tourism platform for **Turkestan, Kazakhstan** — diploma project with enterprise-style architecture.

## Design

Landing page follows the official infographic layout:

- Cream background (`#F5F0E8`), charcoal text (`#2D3436`), heritage teal (`#4A8699`)
- Hero: **TURKISTAN** + tagline + Yasawi mausoleum + quick facts panel
- Three columns: landmarks | app mockup + features | tourism benefits
- Dark footer with city values

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI | shadcn/ui primitives |
| State | Zustand (persisted) |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod |
| Motion | Framer Motion (landing only) |

## Product modules

| Route | Module |
|-------|--------|
| `/` | Marketing landing (infographic design) |
| `/map` | Google Maps tourism navigator — search, routes, clustering, geolocation |
| `/routes` | Route presets, generate, save, duplicate, compare |
| `/routes/[id]` | Timeline, checklist, map link |
| `/places` | Search, save places |
| `/places/[id]` | Rich place details |
| `/booking` | Hotels, excursions, guides — full booking flow |
| `/qr/[id]` | QR content pages (invalid QR → error) |
| `/audio` | Audio guide player, playlist, transcripts, offline download |
| `/reviews` | Ratings, filters, helpful votes, submit review |
| `/assistant` | AI chat with rule-based recommendations |
| `/profile` | Cabinet: saved items, bookings, QR history, settings |
| `/official` | Official tourism data with sources & dates |
| `/help` | FAQ + feedback (contact, bug, suggestion, complaint) |

## Architecture

```
src/
├── app/                 # Routes (pages)
├── components/          # UI by feature
├── domain/
│   ├── types/           # Domain models
│   └── data/            # Mock CMS-ready content
├── lib/
│   ├── api/             # API layer (swap for real backend)
│   ├── ai/              # Recommendation engine
│   ├── i18n/            # kk / ru / en dictionaries
│   └── utils/           # Geo, map URLs
└── stores/              # Zustand global state
```

## Run locally

```bash
cd turkestan-travel-app
npm install
npm run dev
```

Open http://localhost:3000

### Google Maps (Interactive Map)

Copy `.env.example` to `.env.local` and set your key (never commit real keys):

```env
NEXT_PUBLIC_MAP_PROVIDER=google
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

In [Google Cloud Console](https://console.cloud.google.com/), enable:

- Maps JavaScript API
- Places API
- Directions API
- Geocoding API

Restrict the key to your domains in production. Without a key, the map module shows setup instructions instead of loading tiles.

Map module lives in `src/modules/map/` with reusable pieces: `GoogleMapProvider`, `MapContainer`, `MarkerLayer`, `PlaceSearch`, `RoutePlanner`, `DirectionsPanel`, `PlaceDetailsDrawer`, `UserLocationControl`, `SavedPlacesManager`.

## PWA

- `public/manifest.json` — installable app metadata
- `public/sw.js` — service worker scaffold (extend for full offline)
- Offline banner when `navigator.onLine` is false
- User data persisted in localStorage via Zustand

## Future integration

- **API**: Replace `lib/api/*` mock calls with REST/GraphQL
- **Auth**: Wire `useUserStore` to OAuth/JWT
- **Payments**: Hook booking confirmation to payment provider
- **CMS**: Load `domain/data` from headless CMS
- **AI**: Replace rule engine in `lib/ai/recommendations.ts` with LLM API

## Author

Diploma project — 2026
