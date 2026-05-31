"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FALLBACK = "/images/fallback.svg";

type SafeImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

/** Native img — avoids Next/Image remote blocking; fallback on error */
export function SafeImage({
  src,
  alt,
  className,
  fill,
  priority,
}: SafeImageProps) {
  const [current, setCurrent] = useState(src);

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={current}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => {
          if (current !== FALLBACK) setCurrent(FALLBACK);
        }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK);
      }}
    />
  );
}
