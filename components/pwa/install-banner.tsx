"use client";

import { useState, useEffect } from "react";

export function InstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already installed — never show again
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("oficiosgo-installed") === "true") return;

    // Dismissed this session only — will come back next visit
    if (sessionStorage.getItem("oficiosgo-banner-hidden") === "true") return;

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Check prompt captured before React
    if ((window as any).__pwaInstallPrompt) {
      setDeferredPrompt((window as any).__pwaInstallPrompt);
      setTimeout(() => setShow(true), 1500);
    }

    // Listen for future prompts (Android)
    const handler = (e: Event) => {
      e.preventDefault();
      (window as any).__pwaInstallPrompt = e;
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS: show after delay
    if (ios) setTimeout(() => setShow(true), 2000);

    // Installed successfully — hide forever
    window.addEventListener("appinstalled", () => {
      setShow(false);
      localStorage.setItem("oficiosgo-installed", "true");
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setShow(false);
          localStorage.setItem("oficiosgo-installed", "true");
        }
      } catch {}
      setDeferredPrompt(null);
      (window as any).__pwaInstallPrompt = null;
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // X button = hide for this session only, comes back next visit
  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("oficiosgo-banner-hidden", "true");
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed bottom-[68px] left-3 right-3 z-40" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="bg-gradient-to-r from-[#1A1D2E] to-[#252839] rounded-2xl p-3 flex items-center gap-3 shadow-2xl border border-[#F8C927]/20 animate-slideUp">
          <div className="w-11 h-11 rounded-xl bg-[#F8C927] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D2E" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-white leading-tight">Instalar OficiosGo!</div>
            <div className="text-[11px] text-gray-400 leading-tight mt-0.5">Acceso rapido desde tu pantalla</div>
          </div>
          <button onClick={handleInstall} className="px-4 py-2 rounded-xl bg-[#F8C927] text-[#1A1D2E] text-[12px] font-extrabold shrink-0 active:scale-95 transition-transform">
            Instalar
          </button>
          <button onClick={handleDismiss} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0" aria-label="Cerrar">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowIOSGuide(false)} />
          <div className="relative w-full max-w-[430px] bg-[#1A1D2E] rounded-t-3xl overflow-hidden" style={{ animation: "iosSlide 0.3s ease-out" }}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-white.svg" alt="OficiosGo!" className="h-8 w-auto" />
              <button onClick={() => setShowIOSGuide(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="px-5 pb-8">
              <h3 className="text-lg font-black text-white mb-1">Instala la app en tu celular</h3>
              <p className="text-sm text-gray-400 mb-5">Sin descargar nada del store - 2 pasos</p>
              <div className="space-y-4">
                <div className="flex gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#F8C927] flex items-center justify-center text-[#1A1D2E] text-sm font-black shrink-0">1</div>
                  <div className="pt-0.5">
                    <p className="text-sm font-bold text-white">Toca el boton de compartir</p>
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 w-fit">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                      <span className="text-xs text-gray-300">Este icono en la barra de abajo</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#F8C927] flex items-center justify-center text-[#1A1D2E] text-sm font-black shrink-0">2</div>
                  <div className="pt-0.5">
                    <p className="text-sm font-bold text-white">Elegi &quot;Agregar a inicio&quot;</p>
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 w-fit">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                      <span className="text-xs text-gray-300">Agregar a pantalla de inicio</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-5 animate-bounce">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2.5" strokeLinecap="round"><line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        @keyframes iosSlide { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </>
  );
}