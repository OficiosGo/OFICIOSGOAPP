"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function EyeIcon({ open }: { open: boolean }) {
  if (open) return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>);
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Email o contraseña incorrectos"); return; }
      router.push("/app/dashboard");
      router.refresh();
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
        <h1 className="text-2xl font-black text-white">Iniciar sesión</h1>
        <p className="text-sm text-gray-400 mt-1">Accedé a tu panel de profesional</p>
      </div>

      <div className="flex-1 bg-[#F5F5F7] rounded-t-[28px] px-6 pt-8 pb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">{error}</div>
          )}
          <div>
            <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">Contraseña</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20 bg-white pr-12" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600">
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-[#1A1D2E] text-[#F8C927] font-extrabold text-[15px] disabled:opacity-50 active:scale-[0.98] transition-transform">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <Link href="/forgot-password" className="block text-center text-sm text-[#5C80BC] font-semibold mt-4">
          {"¿Olvidaste tu contraseña?"}
        </Link>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            {"¿No tenés cuenta? "}
            <Link href="/registro" className="text-[#5C80BC] font-bold">Registrate gratis</Link>
          </p>
        </div>

        <Link href="/" className="block text-center text-xs text-gray-400 mt-6 hover:text-gray-600">
          {"← Volver al inicio"}
        </Link>
      </div>
    </div>
  );
}