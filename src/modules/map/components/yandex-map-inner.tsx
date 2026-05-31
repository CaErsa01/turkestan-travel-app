"use client";

import { useEffect, useRef, useState } from "react";
import type { MapViewProps } from "../providers/types";
import { getYandexMapsApiKey } from "../providers/config";
import { TURKESTAN_CENTER } from "../constants";
import { MARKER_COLORS } from "../constants";
import type { MapLayerId } from "../types";

declare global {
  interface Window {
    ymaps?: {
      ready: (cb: () => void) => void;
      Map: new (
        el: HTMLElement,
        opts: { center: number[]; zoom: number; controls?: string[] }
      ) => YMap;
      Placemark: new (
        coords: number[],
        props?: object,
        opts?: { preset?: string; iconColor?: string }
      ) => unknown;
      Polyline: new (
        coords: number[][],
        props?: object,
        opts?: { strokeColor?: string; strokeWidth?: number }
      ) => unknown;
      Circle: new (
        coords: number[][],
        props?: object,
        opts?: object
      ) => unknown;
    };
  }
}

type YMap = {
  geoObjects: { add: (o: unknown) => void; remove: (o: unknown) => void };
  setCenter: (c: number[], z?: number) => void;
  setBounds: (b: number[][], opts?: object) => void;
  destroy: () => void;
};

let yandexScriptPromise: Promise<void> | null = null;

function loadYandexScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.reject();
  if (window.ymaps) return Promise.resolve();
  if (yandexScriptPromise) return yandexScriptPromise;
  yandexScriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Yandex Maps script failed"));
    document.head.appendChild(s);
  });
  return yandexScriptPromise;
}

export function YandexMapInner({
  center,
  zoom,
  markers,
  routePolyline,
  userLocation,
  selectedMarkerId,
  onMarkerClick,
  onMapReady,
  onMapError,
  className,
}: MapViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YMap | null>(null);
  const objectsRef = useRef<unknown[]>([]);
  const [ready, setReady] = useState(false);
  const apiKey = getYandexMapsApiKey();

  useEffect(() => {
    if (!apiKey || !ref.current) {
      onMapError?.("Yandex Maps API key missing");
      return;
    }

    let destroyed = false;

    loadYandexScript(apiKey)
      .then(() => {
        if (destroyed || !ref.current || !window.ymaps) return;
        window.ymaps.ready(() => {
          if (destroyed || !ref.current) return;
          const map = new window.ymaps!.Map(ref.current!, {
            center: [center.lat, center.lng],
            zoom,
            controls: ["zoomControl", "fullscreenControl"],
          });
          mapRef.current = map;
          setReady(true);
          onMapReady?.();
        });
      })
      .catch((e) => onMapError?.(e.message));

    return () => {
      destroyed = true;
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [apiKey, onMapError, onMapReady]);

  useEffect(() => {
    if (!ready || !mapRef.current || !window.ymaps) return;
    const map = mapRef.current;
    const ymaps = window.ymaps;

    for (const o of objectsRef.current) {
      try {
        map.geoObjects.remove(o);
      } catch {
        /* ignore */
      }
    }
    objectsRef.current = [];

    map.setCenter([center.lat, center.lng], zoom);

    const circle = new ymaps.Circle(
      [[center.lat, center.lng], 25000] as unknown as number[][],
      {},
      { fillColor: "#0D737733", strokeColor: "#0D7377", strokeWidth: 1 }
    );
    map.geoObjects.add(circle);
    objectsRef.current.push(circle);

    if (userLocation) {
      const user = new ymaps.Placemark(
        [userLocation.lat, userLocation.lng],
        { hintContent: "You" },
        { preset: "islands#blueCircleDotIcon" }
      );
      map.geoObjects.add(user);
      objectsRef.current.push(user);
    }

    markers.forEach((m) => {
      const pm = new ymaps.Placemark(
        [m.position.lat, m.position.lng],
        { hintContent: m.label, balloonContent: m.label },
        {
          iconColor: MARKER_COLORS[m.layer as MapLayerId] ?? "#0D7377",
        }
      ) as { events: { add: (e: string, h: () => void) => void } };
      pm.events.add("click", () => onMarkerClick(m.id));
      map.geoObjects.add(pm);
      objectsRef.current.push(pm);
    });

    if (routePolyline.length > 1) {
      const line = new ymaps.Polyline(
        routePolyline.map((p) => [p.lat, p.lng]),
        {},
        { strokeColor: "#0D7377", strokeWidth: 4 }
      );
      map.geoObjects.add(line);
      objectsRef.current.push(line);
      map.setBounds(
        routePolyline.map((p) => [p.lat, p.lng]),
        { checkZoomRange: true }
      );
    }
  }, [
    ready,
    center,
    zoom,
    markers,
    routePolyline,
    userLocation,
    selectedMarkerId,
    onMarkerClick,
  ]);

  return <div ref={ref} className={className ?? "h-full w-full min-h-[320px]"} />;
}
