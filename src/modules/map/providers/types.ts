import type { LatLng, MapMarker, MapProviderId, MapProviderStatus } from "../types";

export type MapViewProps = {
  center: LatLng;
  zoom: number;
  markers: MapMarker[];
  routePolyline: LatLng[];
  userLocation: LatLng | null;
  selectedMarkerId: string | null;
  onMarkerClick: (id: string) => void;
  onMapReady?: () => void;
  onMapError?: (message: string) => void;
  className?: string;
};

export type MapProviderAdapter = {
  id: MapProviderId;
  displayName: string;
};

export type MapInstanceStatus = {
  status: MapProviderStatus;
  message?: string;
};
