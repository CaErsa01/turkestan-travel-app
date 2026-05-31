"use client";

import { useEffect, useState } from "react";
import { qrImageUrl } from "@/lib/qr/urls";
import { cn } from "@/lib/utils";

type QrCodeImageProps = {
  placeId: string;
  size?: number;
  className?: string;
  alt?: string;
};

export function QrCodeImage({ placeId, size = 140, className, alt = "QR" }: QrCodeImageProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    setSrc(qrImageUrl(placeId, size));
  }, [placeId, size]);

  if (!src) {
    return (
      <div
        className={cn("animate-pulse rounded-lg bg-charcoal/10", className)}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-lg border border-charcoal/10 bg-white p-1", className)}
      loading="lazy"
      decoding="async"
    />
  );
}
