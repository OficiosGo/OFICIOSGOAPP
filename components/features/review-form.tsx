"use client";

import { useState, useEffect } from "react";

type Props = {
  profileId: string;
  professionalName: string;
};

export function ReviewForm({ profileId, professionalName }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.data) {
        setIsLoggedIn(true);
        setName(d.data.name || "");
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (rating === 0) { setError("Selecciona una puntuacion"); return; }
    if (!isLoggedIn && (!name || !phone)) { setError("Completa tu nombre y telefono"); return; }

    setLoading(true);
    try {
      const endpoint = isLoggedIn ? "/api/reviews" : "/api/reviews/public";
      const body = isLoggedIn
        ? { profileId, rating, comment: comment || undefined }
        : { profileId, rating, comment: comment || undefined, authorName: name, authorPhone: phone };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error || "Error al enviar"); return; }
      setSuccess(true);
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-5 rounded-2xl bg-green-50 border border-green-100 text-center">
        <div className="text-3xl mb-2">✅</div>
        <p className="text-sm font-bold text-green-700">Gracias por tu resena</p>
        <p className="text-xs text-green-600 mt-1">Tu opinion ayuda a otros vecinos de Villa Maria</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-white border-2 border-dashed border-[#F8C927] text-[#1A1D2E] text-sm font-bold active:scale-[0.98] transition-transform"
      >
        <span className="text-lg">⭐</span>
        Dejar una resena a {professionalName}
      </button>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-black text-[#1A1D2E]">Tu resena</h3>
        <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 mb-4">{error}</div>}

      {/* Stars */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => setRating(s)}
            onMouseEnter={() => setHoverRating(s)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 transition-transform active:scale-110"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill={s <= (hoverRating || rating) ? "#F8C927" : "#E5E7EB"} className="transition-colors">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mb-4">
        {rating === 0 ? "Toca una estrella" : rating <= 2 ? "Puede mejorar" : rating <= 3 ? "Bueno" : rating === 4 ? "Muy bueno" : "Excelente"}
      </p>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Conta tu experiencia con este profesional... (opcional)"
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20 resize-none mb-3"
      />

      {/* Name/Phone for non-logged-in users */}
      {!isLoggedIn && (
        <div className="space-y-3 mb-4">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] text-gray-400 mb-2">Para verificar tu resena:</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927] mb-2"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Tu telefono"
              type="tel"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927]"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || rating === 0}
        className="w-full py-3.5 rounded-xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-sm disabled:opacity-50 active:scale-[0.98] transition-transform"
      >
        {loading ? "Enviando..." : "Publicar resena"}
      </button>
    </div>
  );
}