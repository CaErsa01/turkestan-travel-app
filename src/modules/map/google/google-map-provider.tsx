"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { getGoogleMapsApiKey, isGoogleMapsConfigured } from "../providers/config";

export const GOOGLE_MAP_LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

type GoogleServices = {
  directionsService: google.maps.DirectionsService | null;
  geocoder: google.maps.Geocoder | null;
  placesService: google.maps.places.PlacesService | null;
  autocompleteService: google.maps.places.AutocompleteService | null;
};

type GoogleMapContextValue = {
  isConfigured: boolean;
  isLoaded: boolean;
  loadError: Error | undefined;
  map: google.maps.Map | null;
} & GoogleServices & {
    setMap: (map: google.maps.Map | null) => void;
  };

const GoogleMapContext = createContext<GoogleMapContextValue | null>(null);

const emptyServices: GoogleServices = {
  directionsService: null,
  geocoder: null,
  placesService: null,
  autocompleteService: null,
};

export function GoogleMapProvider({ children }: { children: ReactNode }) {
  const apiKey = getGoogleMapsApiKey() ?? "";
  const isConfigured = isGoogleMapsConfigured();
  const [map, setMapState] = useState<google.maps.Map | null>(null);
  const [services, setServices] = useState<GoogleServices>(emptyServices);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "turkistan-google-maps",
    googleMapsApiKey: isConfigured ? apiKey : " ",
    libraries: GOOGLE_MAP_LIBRARIES,
    preventGoogleFontsLoading: true,
  });

  const setMap = useCallback((m: google.maps.Map | null) => {
    if (mapRef.current === m) return;
    mapRef.current = m;
    setMapState(m);
    if (m && typeof google !== "undefined") {
      setServices({
        directionsService: new google.maps.DirectionsService(),
        geocoder: new google.maps.Geocoder(),
        placesService: new google.maps.places.PlacesService(m),
        autocompleteService: new google.maps.places.AutocompleteService(),
      });
    } else {
      setServices(emptyServices);
    }
  }, []);

  const value = useMemo<GoogleMapContextValue>(
    () => ({
      isConfigured,
      isLoaded: isConfigured && isLoaded,
      loadError,
      map,
      setMap,
      ...services,
    }),
    [isConfigured, isLoaded, loadError, map, setMap, services]
  );

  return (
    <GoogleMapContext.Provider value={value}>{children}</GoogleMapContext.Provider>
  );
}

export function useGoogleMap() {
  const ctx = useContext(GoogleMapContext);
  if (!ctx) throw new Error("useGoogleMap must be used within GoogleMapProvider");
  return ctx;
}
