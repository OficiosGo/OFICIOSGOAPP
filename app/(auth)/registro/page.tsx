"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";

type Category = { id: string; name: string; slug: string; icon: string | null };

export default function RegisterPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", categoryId: "", city: "Villa María" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(d.data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al registrar");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-gray-50 pt-20 pb-10 px-5">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-yellow inline-flex items-center justify-center text-2xl font-black text-brand-black shadow-lg shadow-brand-yellow/20 mb-4">
              Go
            </div>
            <h1 className="text-3xl font-black text-brand-black">Crear cuenta</h1>
            <p className="text-gray-500 mt-2">Registrate como profesional y empezá a recibir clientes</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white shadow-xl shadow-black/5 border border-gray-200 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-brand-black mb-1.5">Nombre completo</label>
              <input value={form.name} onChange={set("name")} required placeholder="Juan Pérez"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={set("email")} required placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-1.5">Contraseña</label>
              <input type="password" value={form.password} onChange={set("password")} required placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-1.5">Teléfono</label>
              <input value={form.phone} onChange={set("phone")} placeholder="3534112233"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-1.5">Oficio</label>
              <select value={form.categoryId} onChange={set("categoryId")} required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-yellow bg-white">
                <option value="">Seleccioná tu oficio</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-1.5">Ciudad</label>
              <input value={form.city} onChange={set("city")} required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-black text-brand-yellow font-bold text-[15px] hover:bg-gray-800 transition-colors disabled:opacity-60">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <p className="text-center text-sm text-gray-500">
              ¿Ya tenés cuenta?{" "}
              <Link href="/login" className="text-brand-blue font-bold hover:underline">Iniciá sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
