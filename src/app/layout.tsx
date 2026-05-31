import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turkistan Travel App — Smart Tourism Platform",
  description:
    "Discover Digital Turkistan — interactive map, routes, booking, QR guide, audio, AI assistant",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Turkistan Travel" },
};

export const viewport: Viewport = {
  themeColor: "#4A8699",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
