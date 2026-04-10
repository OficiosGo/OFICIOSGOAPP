"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const message = error?.message || "";
    const name = error?.name || "";

    const isChunkError =
      message.includes("ChunkLoadError") ||
      message.includes("Loading chunk") ||
      message.includes("Loading CSS chunk") ||
      name === "ChunkLoadError";

    if (!isChunkError) {
      console.error("[app error]", error);
      return;
    }

    const doReload = () => {
      window.location.reload();
    };

    if (typeof caches !== "undefined") {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .finally(doReload);
      return;
    }

    doReload();
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#F5F5F7]">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-[18px] font-black text-[#1A1D2E] mb-2">
          Algo no anduvo bien
        </h2>
        <p className="text-[13px] text-gray-500 mb-6">
          Tuvimos un problema cargando esta sección. Probá de nuevo.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-sm active:scale-[0.97] transition-transform"
          >
            Reintentar
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-[#1A1D2E] font-bold text-sm active:scale-[0.97] transition-transform"
          >
            Recargar página
          </button>
        </div>
      </div>
    </div>
  );
}