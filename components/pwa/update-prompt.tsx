"use client";

import { useEffect, useState } from "react";

export function UpdatePrompt() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShow(true);
      }

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setShow(true);
          }
        });
      });

      const interval = setInterval(() => {
        registration.update().catch(() => {});
      }, 60000);
      return () => clearInterval(interval);
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed top-3 left-3 right-3 z-[60] max-w-[430px] mx-auto"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="bg-gradient-to-r from-[#F8C927] to-[#F5A623] rounded-2xl p-3 flex items-center gap-3 shadow-2xl animate-slideDown">
        <div className="w-9 h-9 rounded-full bg-[#1A1D2E] flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-extrabold text-[#1A1D2E] leading-tight">
            ¡Nueva versión disponible!
          </div>
          <div className="text-[11px] text-[#1A1D2E]/70 leading-tight mt-0.5">
            Tocá para actualizar
          </div>
        </div>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 rounded-xl bg-[#1A1D2E] text-[#F8C927] text-[12px] font-extrabold shrink-0 active:scale-95 transition-transform"
        >
          Actualizar
        </button>
      </div>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
}