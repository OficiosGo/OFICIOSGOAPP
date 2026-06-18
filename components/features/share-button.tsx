"use client";

import { useState } from "react";

export function ShareButton({ name, title }: { name: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: `${name} en OficiosGo!`,
      text: title || `Mirá el perfil de ${name} en OficiosGo!`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // usuario canceló el share o no hay permisos: no hacemos nada
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label="Compartir perfil"
      className="shrink-0 w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#1A1D2E] active:scale-90 transition-transform"
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
        </svg>
      )}
    </button>
  );
}
