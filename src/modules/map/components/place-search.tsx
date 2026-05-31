"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useGoogleMap } from "../google/google-map-provider";
import { useMapModuleStore } from "../store/use-map-module-store";
import { PLACES, getLocalized } from "@/domain/data/places";
import { TURKESTAN_BOUNDS } from "../constants";
import { useAppStore } from "@/stores/use-app-store";

type Suggestion = { id: string; label: string; source: "local" | "google" };

export function PlaceSearch() {
  const { autocompleteService, geocoder, isLoaded } = useGoogleMap();
  const locale = useAppStore((s) => s.locale);
  const search = useMapModuleStore((s) => s.filter.search);
  const setSearch = useMapModuleStore((s) => s.setSearch);
  const setSelectedPlace = useMapModuleStore((s) => s.setSelectedPlace);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const localMatch = useCallback(
    (q: string): Suggestion[] => {
      const lower = q.toLowerCase();
      return PLACES.filter(
        (p) =>
          p.name.kk.toLowerCase().includes(lower) ||
          p.name.en.toLowerCase().includes(lower) ||
          p.name.ru.toLowerCase().includes(lower)
      )
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          label: getLocalized(p.name, locale),
          source: "local" as const,
        }));
    },
    [locale]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = search.trim();
    if (!trimmed) {
      setSuggestions((prev) => (prev.length === 0 ? prev : []));
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const local = localMatch(trimmed);
      setSuggestions(local);
      setOpen(local.length > 0);

      if (isLoaded && autocompleteService && typeof google !== "undefined") {
        const bounds = new google.maps.LatLngBounds(
          { lat: TURKESTAN_BOUNDS.south, lng: TURKESTAN_BOUNDS.west },
          { lat: TURKESTAN_BOUNDS.north, lng: TURKESTAN_BOUNDS.east }
        );
        autocompleteService.getPlacePredictions(
          {
            input: trimmed,
            bounds,
            componentRestrictions: { country: "kz" },
            types: ["establishment", "tourist_attraction", "lodging", "restaurant"],
          },
          (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) return;
            const googleSug: Suggestion[] = predictions.slice(0, 5).map((p) => ({
              id: p.place_id,
              label: p.description,
              source: "google" as const,
            }));
            setSuggestions((prev) => {
              const ids = new Set(prev.map((s) => s.label));
              const merged = [...prev, ...googleSug.filter((g) => !ids.has(g.label))].slice(0, 8);
              return merged.length === prev.length ? prev : merged;
            });
            setOpen(true);
          }
        );
      }
    }, 280);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, localMatch, isLoaded, autocompleteService]);

  const selectSuggestion = (s: Suggestion) => {
    setSearch(s.label);
    setOpen(false);
    if (s.source === "local") {
      setSelectedPlace(s.id);
      return;
    }
    if (geocoder) {
      geocoder.geocode({ placeId: s.id }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const match = PLACES.find((p) => {
            const dLat = Math.abs(p.latitude - results[0].geometry.location.lat());
            const dLng = Math.abs(p.longitude - results[0].geometry.location.lng());
            return dLat < 0.05 && dLng < 0.05;
          });
          if (match) setSelectedPlace(match.id);
        }
      });
    }
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => {
          if (search.trim() && suggestions.length > 0) setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder="Search attractions, hotels, restaurants…"
        className="w-full rounded-xl border border-charcoal/10 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-heritage focus:outline-none focus:ring-2 focus:ring-heritage/20"
        aria-label="Search places"
        aria-autocomplete="list"
      />
      {open && suggestions.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full z-[2000] mt-1 max-h-64 overflow-y-auto rounded-xl border border-charcoal/10 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {suggestions.map((s) => (
            <li key={`${s.source}-${s.id}`}>
              <button
                type="button"
                role="option"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-heritage/10"
                onMouseDown={() => selectSuggestion(s)}
              >
                <MapPin className="h-4 w-4 shrink-0 text-heritage" />
                <span className="truncate">{s.label}</span>
                <span className="ml-auto text-[10px] uppercase text-charcoal/40">{s.source}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
