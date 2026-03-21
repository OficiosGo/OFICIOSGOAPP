"use client";

import { useState, useEffect } from "react";

export function InstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Fallback: show after 3s even without the event (Safari etc)
    const timer = setTimeout(() => setShow(true), 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-[76px] left-3 right-3 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-[#1A1D2E] to-[#252839] rounded-2xl p-3.5 flex items-center gap-3 shadow-2xl border border-[#F8C92733]">
        <div className="w-11 h-11 rounded-xl bg-[#F8C927] flex items-center justify-center text-lg font-black text-[#1A1D2E] shrink-0">
          Go
        </div>
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
        <button onClick={() => setShow(false)} className="text-gray-500 text-lg leading-none px-1">×</button>
      </div>
    </div>
  );
}
