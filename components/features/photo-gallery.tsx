"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Photo = { url: string };

export function PhotoGallery({ photos, name }: { photos: Photo[]; name: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length]
  );
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );

  // Teclado + bloquear scroll del body mientras el visor está abierto
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, next, prev]);

  const grid = photos.slice(0, 6);
  const extra = photos.length - 6;

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5">
        {grid.map((photo, i) => (
          <button
            key={photo.url}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Ver trabajo ${i + 1} de ${name}`}
            className={`relative rounded-xl overflow-hidden bg-gray-100 active:scale-[0.98] transition-transform ${
              i === 0 ? "col-span-2 row-span-2" : ""
            }`}
            style={{ aspectRatio: i === 0 ? "auto" : "1/1" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={`Trabajo ${i + 1} de ${name}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {i === 5 && extra > 0 && (
              <span className="absolute inset-0 bg-black/55 flex items-center justify-center text-white text-base font-black">
                +{extra}
              </span>
            )}
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (dx > 50) prev();
            else if (dx < -50) next();
            touchStartX.current = null;
          }}
        >
          {/* Cerrar */}
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="Cerrar"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center active:scale-90 transition-transform"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Contador */}
          <span className="absolute top-5 left-4 text-white/80 text-[13px] font-semibold">
            {openIndex + 1} / {photos.length}
          </span>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[openIndex].url}
            alt={`Trabajo ${openIndex + 1} de ${name}`}
            className="max-w-[94vw] max-h-[82vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center active:scale-90 transition-transform"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center active:scale-90 transition-transform"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
