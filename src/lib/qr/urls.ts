/** Base URL for QR codes (production domain). Falls back to current origin in browser. */
export function getAppBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/** Page opened when a tourist scans the QR code at a site. */
export function qrTargetUrl(placeId: string, baseUrl?: string): string {
  const base = baseUrl ?? getAppBaseUrl();
  return `${base.replace(/\/$/, "")}/qr/${placeId}`;
}

/** External QR image API — encodes the scan target URL. */
export function qrImageUrl(placeId: string, size = 160, baseUrl?: string): string {
  const data = encodeURIComponent(qrTargetUrl(placeId, baseUrl));
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}&margin=8`;
}
