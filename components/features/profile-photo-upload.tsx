"use client";

import { useState, useRef } from "react";

export function ProfilePhotoUpload({ currentImage, userName }: { currentImage?: string | null; userName: string }) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const initials = userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2000000) { alert("Máximo 2MB"); return; }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.data?.url) {
        setPreview(data.data.url);
      } else {
        alert(data.error || "Error al subir");
      }
    } catch {
      alert("Error de conexión");
    }
    setUploading(false);
  };

  return (
    <div className="relative">
      <div onClick={() => fileRef.current?.click()} className="w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 border-white/20 shadow-lg">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={userName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white text-xl font-black">
            {initials}
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#F8C927] flex items-center justify-center shadow-md cursor-pointer" onClick={() => fileRef.current?.click()}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1A1D2E" strokeWidth="2.5" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
      </div>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" />
    </div>
  );
}