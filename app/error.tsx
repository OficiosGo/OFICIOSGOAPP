"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-black text-brand-black mb-2">Algo salió mal</h2>
        <p className="text-gray-500 mb-6">Estamos trabajando para solucionarlo.</p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-brand-yellow text-brand-black font-bold hover:bg-yellow-300 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
