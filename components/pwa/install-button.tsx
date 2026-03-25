"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function InstallButton({ variant = "small" }: { variant?: "small" | "full" }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (installed) return null;

  if (variant === "small") {
    return (
      <>
        <button onClick={handleInstall} className="w-10 h-10 rounded-full bg-[#F8C927]/15 flex items-center justify-center" aria-label="Instalar app">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
        </button>
        {showIOSGuide && <IOSGuidePortal onClose={() => setShowIOSGuide(false)} />}
      </>
    );
  }

  return (
    <>
      <button onClick={handleInstall} className="flex items-center gap-3 w-full px-4 py-4 rounded-xl bg-gradient-to-r from-[#1A1D2E] to-[#252839] border border-[#F8C927]/20 text-left">
        <div className="w-10 h-10 rounded-xl bg-[#F8C927] flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D2E" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white">Instalar OficiosGo!</div>
          <div className="text-[11px] text-gray-400">Acceso directo desde tu pantalla de inicio</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
      </button>
      {showIOSGuide && <IOSGuidePortal onClose={() => setShowIOSGuide(false)} />}
    </>
  );
}

function IOSGuidePortal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={onClose} />
      <div style={{ position: "relative", width: "100%", maxWidth: 430, background: "#1A1D2E", borderRadius: "24px 24px 0 0", overflow: "hidden", animation: "iosSlide 0.3s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 12px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="OficiosGo!" style={{ height: 32, width: "auto" }} />
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
        <div style={{ padding: "0 20px 32px" }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Instalá la app en tu celular</h3>
          <p style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 20 }}>Sin descargar nada del store · 2 pasos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F8C927", display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1D2E", fontSize: 14, fontWeight: 900, flexShrink: 0 }}>1</div>
              <div style={{ paddingTop: 2 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Tocá el botón de compartir</p>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 12, background: "rgba(255,255,255,0.1)", width: "fit-content" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
                  <span style={{ fontSize: 12, color: "#D1D5DB" }}>Este ícono en la barra de abajo</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F8C927", display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1D2E", fontSize: 14, fontWeight: 900, flexShrink: 0 }}>2</div>
              <div style={{ paddingTop: 2 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Elegí &quot;Agregar a inicio&quot;</p>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 12, background: "rgba(255,255,255,0.1)", width: "fit-content" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" x2="12" y1="8" y2="16" /><line x1="8" x2="16" y1="12" y2="12" /></svg>
                  <span style={{ fontSize: 12, color: "#D1D5DB" }}>Agregar a pantalla de inicio</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20, animation: "iosBounce 1s ease infinite" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2.5" strokeLinecap="round"><line x1="12" x2="12" y1="5" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
          </div>
        </div>
        <style>{`
          @keyframes iosSlide { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
          @keyframes iosBounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(6px); } }
        `}</style>
      </div>
    </div>,
    document.body
  );
}