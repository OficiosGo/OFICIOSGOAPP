"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function EyeIcon({ open }: { open: boolean }) {
  if (open) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-lg font-black text-[#1A1D2E] mb-2">Link inválido</h2>
        <p className="text-sm text-gray-500 mb-6">Este link no es válido o ya expiró.</p>
        <Link href="/forgot-password" className="inline-block px-6 py-3 rounded-xl bg-[#1A1D2E] text-[#F8C927] font-extrabold text-sm">
          Pedir uno nuevo
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Mínimo 6 caracteres"); return; }
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al cambiar la contraseña"); return; }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch { setError("Error de conexión"); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-lg font-black text-[#1A1D2E] mb-2">Contraseña cambiada</h2>
        <p className="text-sm text-gray-500">Redirigiendo al login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">{error}</div>
      )}
      <div>
        <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">Nueva contraseña</label>
        <div className="relative">
          <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres"
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20 bg-white pr-12" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600">
            <EyeIcon open={showPw} />
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">Repetir contraseña</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repetí tu contraseña"
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20 bg-white" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-4 rounded-xl bg-[#1A1D2E] text-[#F8C927] font-extrabold text-[15px] disabled:opacity-50 active:scale-[0.98] transition-transform">
        {loading ? "Cambiando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1D2E] to-[#252839] flex flex-col">
      <div className="pt-12 pb-8 text-center px-6">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="OficiosGo!" className="h-12 w-auto mx-auto mb-5" />
        </Link>
        <h1 className="text-2xl font-black text-white">Nueva contraseña</h1>
        <p className="text-sm text-gray-400 mt-1">Elegí una contraseña nueva para tu cuenta</p>
      </div>

      <div className="flex-1 bg-[#F5F5F7] rounded-t-[28px] px-6 pt-8 pb-10">
        <Suspense fallback={<div className="text-center py-8 text-gray-400">Cargando...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}