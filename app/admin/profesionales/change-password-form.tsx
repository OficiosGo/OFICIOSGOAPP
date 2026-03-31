"use client";

import { useState } from "react";

export function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!current) { setError("Ingresá tu contraseña actual"); return; }
    if (newPw.length < 6) { setError("Mínimo 6 caracteres"); return; }
    if (newPw !== confirm) { setError("Las contraseñas no coinciden"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error"); return; }
      setSuccess(true);
      setCurrent(""); setNewPw(""); setConfirm("");
      setTimeout(() => { setSuccess(false); setOpen(false); }, 2000);
    } catch { setError("Error de conexión"); }
    finally { setLoading(false); }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="col-span-2 p-4 rounded-xl bg-white border border-gray-100 shadow-sm text-center active:scale-[0.97] transition-transform">
        <span className="text-lg">🔑</span>
        <div className="text-[12px] font-bold text-[#1A1D2E] mt-1">Cambiar contraseña</div>
      </button>
    );
  }

  return (
    <div className="col-span-2 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-extrabold text-[#1A1D2E]">🔑 Cambiar contraseña</h3>
        <button onClick={() => { setOpen(false); setError(""); }} className="text-xs text-gray-400">Cancelar</button>
      </div>

      {error && <div className="p-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium mb-3">{error}</div>}
      {success && <div className="p-2 rounded-lg bg-green-50 text-green-600 text-xs font-medium mb-3">Contraseña cambiada correctamente</div>}

      <div className="space-y-3">
        <div>
          <label className="block text-[12px] font-semibold text-[#1A1D2E] mb-1">Contraseña actual</label>
          <div className="relative">
            <input type={showCurrent ? "text" : "password"} value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927] pr-10" />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showCurrent ? "🙈" : "👁"}</button>
          </div>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-[#1A1D2E] mb-1">Nueva contraseña</label>
          <div className="relative">
            <input type={showNew ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927] pr-10" />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showNew ? "🙈" : "👁"}</button>
          </div>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-[#1A1D2E] mb-1">Repetir nueva contraseña</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repetí la nueva contraseña" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927]" />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="w-full py-3 rounded-xl bg-[#1A1D2E] text-[#F8C927] font-extrabold text-sm disabled:opacity-50 active:scale-[0.98] transition-transform">
          {loading ? "Cambiando..." : "Cambiar contraseña"}
        </button>
      </div>
    </div>
  );
}