import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OficiosGo! — Profesionales de oficios en Villa María",
    template: "%s | OficiosGo!",
  },
  description:
    "Encontrá electricistas, plomeros, carpinteros, pintores y más profesionales verificados en Villa María, Córdoba.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OficiosGo!",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1A1D2E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
