"use client";

import { useState, useRef, useCallback } from "react";

export function ProfilePhotoUpload({
  currentImage,
  userName,
  onUploadComplete,
}: {
  currentImage?: string | null;
  userName: string;
  onUploadComplete?: (url: string) => void; // FIX 2: prop para notificar al padre
}) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const initials = userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5000000) { alert("Máximo 5MB"); return; }
    const reader = new FileReader();
    reader.onload = () => { setCropSrc(reader.result as string); setScale(1); setPos({ x: 0, y: 0 }); };
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = useCallback(async () => {
    if (!imgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;
    const img = imgRef.current;
    const size = Math.min(img.naturalWidth, img.naturalHeight);

    // FIX 3: compensar scale en el cálculo del crop
    const sx = (img.naturalWidth - size) / 2 - (pos.x / 280) * (size / scale);
    const sy = (img.naturalHeight - size) / 2 - (pos.y / 280) * (size / scale);
    const sSize = size / scale;

    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, 400, 400);

    setCropSrc(null);
    setUploading(true);

    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.85)
      );
      const formData = new FormData();
      formData.append("file", blob, "profile.jpg");

      const res = await fetch("/api/upload", { method: "POST", body: formData });

      // FIX 1: leer la URL del response y notificar al padre
      if (!res.ok) {
        alert("Error al subir la foto");
      } else {
        const json = await res.json();
        const url = json?.data?.url;
        if (url) {
          setPreview(url);         // usar URL real del blob, no el base64
          onUploadComplete?.(url); // notificar al padre con la URL
        }
      }
    } catch {
      alert("Error de conexión");
    }

    setUploading(false);
  }, [pos, scale, onUploadComplete]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    dragRef.current = { dragging: true, startX: t.clientX, startY: t.clientY, origX: pos.x, origY: pos.y };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current.dragging) return;
    const t = e.touches[0];
    setPos({ x: dragRef.current.origX + (t.clientX - dragRef.current.startX), y: dragRef.current.origY + (t.clientY - dragRef.current.startY) });
  };
  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.dragging) return;
    setPos({ x: dragRef.current.origX + (e.clientX - dragRef.current.startX), y: dragRef.current.origY + (e.clientY - dragRef.current.startY) });
  };
  const onEnd = () => { dragRef.current.dragging = false; };

  return (
    <>
      <div className="relative">
        <div onClick={() => fileRef.current?.click()} className="w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 border-white/20 shadow-lg">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white text-xl font-black">{initials}</div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div
          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#F8C927] flex items-center justify-center shadow-md cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1A1D2E" strokeWidth="2.5" strokeLinecap="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" />
      </div>

      {cropSrc && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4">
          <canvas ref={canvasRef} className="hidden" />
          <div className="w-full max-w-[340px]">
            <div className="text-center mb-3">
              <h3 className="text-white font-bold text-base">Recortá tu foto</h3>
              <p className="text-gray-400 text-xs mt-0.5">Arrastrá para centrar y usá el slider para zoom</p>
            </div>
            <div
              className="relative w-[280px] h-[280px] mx-auto rounded-2xl overflow-hidden bg-black border-2 border-[#F8C927]/50"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onEnd}
              onMouseLeave={onEnd}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onEnd}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={cropSrc}
                alt="Crop"
                className="absolute select-none pointer-events-none"
                draggable={false}
                style={{
                  width: `${100 * scale}%`,
                  height: `${100 * scale}%`,
                  objectFit: "cover",
                  left: `${50 + pos.x / 2.8}%`,
                  top: `${50 + pos.y / 2.8}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
              <div className="absolute inset-0 border-2 border-white/30 rounded-2xl pointer-events-none" />
            </div>
            <div className="flex items-center gap-3 mt-3 px-2">
              <span className="text-white text-xs">-</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="flex-1 accent-[#F8C927]"
              />
              <span className="text-white text-xs">+</span>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setCropSrc(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold text-sm active:scale-[0.97] transition-transform"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-sm active:scale-[0.97] transition-transform"
              >
                Guardar foto
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}