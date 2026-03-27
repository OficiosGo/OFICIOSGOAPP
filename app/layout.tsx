import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OficiosGo! — Profesionales de oficios en Villa María, Córdoba",
    template: "%s | OficiosGo! Villa María",
  },
  description:
    "Encontrá electricistas, plomeros, pintores, carpinteros y más profesionales verificados en Villa María, Córdoba. Opiniones reales. Contacto directo por WhatsApp.",
  keywords: [
    "plomero villa maría",
    "electricista villa maría córdoba",
    "pintor villa maría",
    "carpintero villa maría",
    "servicios del hogar villa maría",
    "profesionales oficios villa maría",
    "contratar plomero córdoba",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "OficiosGo!",
    title: "OficiosGo! — Profesionales de oficios verificados en Villa María",
    description: "Electricistas, plomeros, pintores y más. Verificados, con opiniones reales. App gratis para Villa María, Córdoba.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OficiosGo! — Profesionales de oficios en Villa María",
    description: "Encontrá profesionales verificados en Villa María, Córdoba.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OficiosGo!",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  other: { "mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8C927" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1120" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "OficiosGo!",
  description: "Plataforma de profesionales de oficios verificados en Villa María, Córdoba, Argentina.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://oficiosgo.com",
  logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://oficiosgo.com"}/icons/icon-512.png`,
  address: { "@type": "PostalAddress", addressLocality: "Villa María", addressRegion: "Córdoba", addressCountry: "AR" },
  areaServed: { "@type": "City", name: "Villa María" },
  serviceType: ["Plomería", "Electricidad", "Pintura", "Carpintería", "Limpieza", "Gasista", "Herrería", "Cerrajería"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" dir="ltr">
      <head>
        <meta charSet="utf-8" />

        {/* Capture PWA install prompt before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `window.__pwaInstallPrompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaInstallPrompt=e;});` }} />

        {/* JSON-LD Schema.org */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Icons */}
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>

      <body className="min-h-screen antialiased overflow-x-hidden" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}