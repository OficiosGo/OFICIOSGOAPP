"use client";

import { useState, useEffect } from "react";

export function InstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Don't show if already installed as standalone
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Don't show if user already dismissed or installed
    if (localStorage.getItem("oficiosgo-install-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Small delay so the page loads first
      setTimeout(() => setShow(true), 2500);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Fallback for Safari/iOS: show banner after 3s even without the event
    // (Safari doesn't fire beforeinstallprompt)
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
          setShow(true);
        }
      }
    }, 3000);

    // Listen for successful install
    window.addEventListener("appinstalled", () => {
      setShow(false);
      localStorage.setItem("oficiosgo-install-dismissed", "installed");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Chrome/Android: trigger native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        localStorage.setItem("oficiosgo-install-dismissed", "installed");
      }
      setDeferredPrompt(null);
      setShow(false);
    } else {
      // iOS fallback: show instructions
      alert(
        "Para instalar OficiosGo! en tu iPhone:\n\n" +
        "1. Tocá el botón de compartir (📤) abajo\n" +
        "2. Elegí \"Agregar a pantalla de inicio\"\n" +
        "3. Tocá \"Agregar\"\n\n" +
        "¡Listo! La app queda en tu pantalla como una app más."
      );
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("oficiosgo-install-dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-[76px] left-3 right-3 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-[#1A1D2E] to-[#252839] rounded-2xl p-3.5 flex items-center gap-3 shadow-2xl border border-[#F8C92733]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-white.svg" alt="OficiosGo!" className="h-9 w-auto shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-white">Instalar OficiosGo!</div>
          <div className="text-[11px] text-gray-400">Acceso directo en tu pantalla</div>
        </div>
        <button
          onClick={handleInstall}
          className="px-4 py-2 rounded-xl bg-[#F8C927] text-[#1A1D2E] text-xs font-extrabold shrink-0"
        >
          Instalar
        </button>
        <button
          onClick={handleDismiss}
          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0"
          aria-label="Cerrar"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}