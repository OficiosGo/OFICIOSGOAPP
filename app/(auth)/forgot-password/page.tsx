"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) { setError("Error al enviar. Intentá de nuevo."); return; }
      setSent(true);
    } catch { setError("Error de conexión"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1D2E] to-[#252839] flex flex-col">
      <div className="pt-12 pb-8 text-center px-6">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="OficiosGo!" className="h-12 w-auto mx-auto mb-5" />
        </Link>
        <h1 className="text-2xl font-black text-white">Recuperar contraseña</h1>
        <p className="text-sm text-gray-400 mt-1">Te enviamos un email para cambiarla</p>
      </div>

      <div className="flex-1 bg-[#F5F5F7] rounded-t-[28px] px-6 pt-8 pb-10">
        {sent ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-lg font-black text-[#1A1D2E] mb-2">Email enviado</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Si el email está registrado, vas a recibir un link para cambiar tu contraseña. Revisá tu bandeja de entrada y spam.
            </p>
            <Link href="/login" className="inline-block px-6 py-3 rounded-xl bg-[#1A1D2E] text-[#F8C927] font-extrabold text-sm">
              Volver al login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">{error}</div>
            )}
            <div>
              <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">Email de tu cuenta</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20 bg-white" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl bg-[#1A1D2E] text-[#F8C927] font-extrabold text-[15px] disabled:opacity-50 active:scale-[0.98] transition-transform">
              {loading ? "Enviando..." : "Enviar link de recuperación"}
            </button>
          </form>
        )}

        <Link href="/login" className="block text-center text-sm text-[#5C80BC] font-semibold mt-6">
          ← Volver al login
        </Link>
      </div>
    </div>
  );
}