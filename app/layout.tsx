import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://oficiosgo.com";

export const metadata: Metadata = {
  title: {
    default: "OficiosGo! — Profesionales de oficios en Villa María y Villa Nueva, Córdoba",
    template: "%s | OficiosGo! Villa María",
  },
  description:
    "Encontrá electricistas, plomeros, pintores, carpinteros y más profesionales verificados en Villa María y Villa Nueva, Córdoba. Opiniones reales. Contacto directo por WhatsApp.",
  applicationName: "OficiosGo!",
  keywords: [
    "plomero villa maría",
    "electricista villa maría córdoba",
    "pintor villa maría",
    "carpintero villa maría",
    "servicios del hogar villa maría",
    "profesionales oficios villa maría",
    "contratar plomero córdoba",
  ],
  authors: [{ name: "OficiosGo!" }],
  creator: "OficiosGo!",
  publisher: "OficiosGo!",
  metadataBase: new URL(APP_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: APP_URL,
    siteName: "OficiosGo!",
    title: "OficiosGo! — Profesionales de oficios verificados en Villa María y Villa Nueva",
    description:
      "Electricistas, plomeros, pintores y más. Verificados, con opiniones reales. App gratis para Villa María y Villa Nueva, Córdoba.",
    images: [
      {
        url: `${APP_URL}/icons/web-app-manifest-512x512.png`,
        width: 512,
        height: 512,
        alt: "OficiosGo!",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OficiosGo! — Profesionales de oficios en Villa María y Villa Nueva",
    description: "Encontrá profesionales verificados en Villa María y Villa Nueva, Córdoba.",
    images: [`${APP_URL}/icons/web-app-manifest-512x512.png`],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "any" },
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/icons/web-app-manifest-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/web-app-manifest-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/icons/favicon.ico"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OficiosGo!",
    startupImage: [
      { url: "/icons/apple-touch-icon.png" },
    ],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "OficiosGo!",
    "msapplication-TileColor": "#1A1D2E",
    "msapplication-tap-highlight": "no",
  },
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
  description:
    "Plataforma de profesionales de oficios verificados en Villa María y Villa Nueva, Córdoba, Argentina.",
  url: APP_URL,
  logo: `${APP_URL}/icons/web-app-manifest-512x512.png`,
  image: `${APP_URL}/icons/web-app-manifest-512x512.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Villa María",
    addressRegion: "Córdoba",
    addressCountry: "AR",
  },
  areaServed: [
    { "@type": "City", name: "Villa María" },
    { "@type": "City", name: "Villa Nueva" },
  ],
  serviceType: [
    "Plomería",
    "Electricidad",
    "Pintura",
    "Carpintería",
    "Limpieza",
    "Gasista",
    "Herrería",
    "Cerrajería",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" dir="ltr">
      <head>
        <meta charSet="utf-8" />

        {/* Capture PWA install prompt before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__pwaInstallPrompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaInstallPrompt=e;});`,
          }}
        />

        {/* JSON-LD Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        className="min-h-screen antialiased overflow-x-hidden"
        style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
      >
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}