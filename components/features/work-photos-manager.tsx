"use client";

import { useState, useRef, useCallback } from "react";

type Photo = { id: string; url: string };

const MAX_PHOTOS = 12;
const MAX_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function WorkPhotosManager({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const remaining = MAX_PHOTOS - photos.length;

  const handleFiles = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (fileRef.current) fileRef.current.value = "";
      if (files.length === 0) return;

      setError(null);
      const toUpload = files.slice(0, remaining);
      if (files.length > remaining) {
        setError(`Solo podés tener ${MAX_PHOTOS} fotos. Se suben las primeras ${remaining}.`);
      }

      setUploading(true);
      for (const file of toUpload) {
        if (!VALID_TYPES.includes(file.type)) {
          setError("Solo se permiten imágenes JPG, PNG o WebP.");
          continue;
        }
        if (file.size > MAX_SIZE) {
          setError("Cada foto debe pesar menos de 5MB.");
          continue;
        }
        try {
          const body = new FormData();
          body.append("file", file);
          const res = await fetch("/api/profile/photos", { method: "POST", body });
          const json = await res.json();
          if (!res.ok) {
            setError(json.error || "Error al subir la foto.");
            break;
          }
          setPhotos((prev) => [...prev, json.data as Photo]);
        } catch {
          setError("No se pudo subir la foto. Revisá tu conexión.");
          break;
        }
      }
      setUploading(false);
    },
    [remaining]
  );

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("¿Borrar esta foto?")) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/profile/photos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || "Error al borrar la foto.");
        return;
      }
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("No se pudo borrar la foto. Revisá tu conexión.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          {photos.length} de {MAX_PHOTOS} foto{photos.length !== 1 ? "s" : ""}
        </p>
        {photos.length > 0 && remaining > 0 && (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="text-[13px] font-bold text-[#1A1D2E] bg-[#F8C927] px-3.5 py-2 rounded-xl active:scale-[0.97] transition-transform disabled:opacity-60"
          >
            {uploading ? "Subiendo…" : "+ Agregar"}
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mb-3 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium"
        >
          {error}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      {photos.length === 0 ? (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full text-center py-14 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 active:scale-[0.99] transition-transform disabled:opacity-60"
        >
          <div className="text-5xl mb-3">📸</div>
          <h3 className="text-base font-bold text-[#1A1D2E] mb-1">
            {uploading ? "Subiendo…" : "Subí fotos de tus trabajos"}
          </h3>
          <p className="text-[13px] text-gray-400 max-w-[260px] mx-auto">
            Las fotos generan confianza y te ayudan a conseguir más clientes. Tocá para elegir.
          </p>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={`Trabajo ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deletingId === photo.id}
                aria-label="Borrar foto"
                className="absolute top-1.5 right-1.5 w-8 h-8 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
              >
                {deletingId === photo.id ? (
                  <span className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          ))}
          {remaining > 0 && (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 aspect-square flex flex-col items-center justify-center gap-1 active:scale-[0.97] transition-transform disabled:opacity-60"
            >
              <span className="text-3xl text-gray-300">＋</span>
              <span className="text-[11px] font-semibold text-gray-400">
                {uploading ? "Subiendo…" : "Agregar"}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
