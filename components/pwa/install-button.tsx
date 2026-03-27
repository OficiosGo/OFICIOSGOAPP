"use client";

import { useState, useEffect } from "react";

export function InstallButton({ variant = "small" }: { variant?: "small" | "full" }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) { setInstalled(true); return; }

    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    if ((window as any).__pwaInstallPrompt) {
      setDeferredPrompt((window as any).__pwaInstallPrompt);
    }

    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try { deferredPrompt.prompt(); await deferredPrompt.userChoice; } catch {}
      setDeferredPrompt(null);
    }
  };

  if (installed) return null;
  if (!deferredPrompt && !isIOS) return null;

  if (variant === "small") {
    return (
      <button onClick={handleInstall} className="w-10 h-10 rounded-full bg-[#F8C927]/15 flex items-center justify-center active:scale-90 transition-transform" aria-label="Instalar app">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" x2="12" y1="15" y2="3"/>
        </svg>
      </button>
    );
  }

  return (
    <button onClick={handleInstall} className="flex items-center gap-3 w-full px-4 py-4 rounded-xl bg-gradient-to-r from-[#1A1D2E] to-[#252839] border border-[#F8C927]/20 text-left active:scale-[0.98] transition-transform">
      <div className="w-10 h-10 rounded-xl bg-[#F8C927] flex items-center justify-center shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D2E" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" x2="12" y1="15" y2="3"/>
        </svg>
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-white">Instalar OficiosGo!</div>
        <div className="text-[11px] text-gray-400">Acceso directo desde tu pantalla</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
    </button>
  );
}