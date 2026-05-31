"use client";

import { Search, X } from "lucide-react";
import { useMapModuleStore } from "../store/use-map-module-store";

export function MapSearchBar() {
  const search = useMapModuleStore((s) => s.filter.search);
  const setSearch = useMapModuleStore((s) => s.setSearch);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search places in Turkestan area…"
        className="w-full rounded-xl border border-charcoal/10 bg-white py-2.5 pl-10 pr-9 text-sm shadow-sm focus:border-heritage focus:outline-none focus:ring-2 focus:ring-heritage/20"
        aria-label="Search places"
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-charcoal/5"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
