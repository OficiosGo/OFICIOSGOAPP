"use client";

import { useState, useEffect } from "react";

type BannerMode = "hidden" | "prompt" | "ios-guide";

export function InstallBanner() {
  const [mode, setMode] = useState<BannerMode>("hidden");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Already installed as standalone
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Already dismissed
    if (localStorage.getItem("oficiosgo-install-dismissed")) return;

    // Android/Chrome: capture the native install event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setMode("prompt"), 2000);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS detection: show custom guide after delay
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isIOS) {
      setTimeout(() => setMode("ios-guide"), 2500);
    }

    // Track successful install
    window.addEventListener("appinstalled", () => {
      setMode("hidden");
      localStorage.setItem("oficiosgo-install-dismissed", "installed");
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        localStorage.setItem("oficiosgo-install-dismissed", "installed");
      }
      setDeferredPrompt(null);
      setMode("hidden");
    }
  };

  const handleDismiss = () => {
    setMode("hidden");
    localStorage.setItem("oficiosgo-install-dismissed", "true");
  };

  if (mode === "hidden") return null;

  // ── ANDROID/CHROME: Simple prompt ──
  if (mode === "prompt") {
    return (
      <div className="fixed bottom-[76px] left-3 right-3 z-50 animate-slide-up">
        <div className="bg-gradient-to-r from-[#1A1D2E] to-[#252839] rounded-2xl p-3.5 flex items-center gap-3 shadow-2xl border border-[#F8C92733]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="OficiosGo!" className="h-9 w-auto shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-white">Instalar OficiosGo!</div>
            <div className="text-[11px] text-gray-400">Acceso directo en tu pantalla</div>
          </div>
          <button onClick={handleNativeInstall} className="px-4 py-2 rounded-xl bg-[#F8C927] text-[#1A1D2E] text-xs font-extrabold shrink-0">
            Instalar
          </button>
          <button onClick={handleDismiss} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0" aria-label="Cerrar">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <style>{`
          @keyframes slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          .animate-slide-up { animation: slide-up 0.3s ease-out; }
        `}</style>
      </div>
    );
  }

  // ── iOS: Visual step-by-step guide ──
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleDismiss} />
      
      <div className="relative w-full max-w-[430px] bg-[#1A1D2E] rounded-t-3xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="OficiosGo!" className="h-8 w-auto" />
          </div>
          <button onClick={handleDismiss} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center" aria-label="Cerrar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="px-5 pb-8">
          <h3 className="text-lg font-black text-white mb-1">Instalá la app en tu celular</h3>
          <p className="text-sm text-gray-400 mb-5">Sin descargar nada del store · 2 pasos</p>

          {/* Steps */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#F8C927] flex items-center justify-center text-[#1A1D2E] text-sm font-black shrink-0">1</div>
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-bold text-white">Tocá el botón de compartir</p>
                <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 w-fit">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" x2="12" y1="2" y2="15"/>
                  </svg>
                  <span className="text-xs text-gray-300">Este ícono en la barra de abajo</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#F8C927] flex items-center justify-center text-[#1A1D2E] text-sm font-black shrink-0">2</div>
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-bold text-white">Elegí &quot;Agregar a inicio&quot;</p>
                <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 w-fit">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <line x1="12" x2="12" y1="8" y2="16"/>
                    <line x1="8" x2="16" y1="12" y2="12"/>
                  </svg>
                  <span className="text-xs text-gray-300">Agregar a pantalla de inicio</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow pointing down to Safari toolbar */}
          <div className="flex justify-center mt-5">
            <div className="animate-bounce">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" x2="12" y1="5" y2="19"/>
                <polyline points="19 12 12 19 5 12"/>
              </svg>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes slide-up { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
          .animate-slide-up { animation: slide-up 0.3s cubic-bezier(.16,1,.3,1); }
        `}</style>
      </div>
    </div>
  );
}