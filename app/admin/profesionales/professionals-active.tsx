"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TierSelect, DeleteProfessionalButton } from "./admin-forms";
import { SuspendButton } from "./suspend-button";

type Category = { id: string; name: string; slug: string; icon: string | null };
type Professional = {
  id: string;
  slug: string;
  city: string;
  tier: string;
  categoryId: string;
  category: { name: string; icon: string | null };
  user: { id: string; name: string; email: string; phone: string | null };
};

export function ProfessionalsActive({ professionals, categories }: { professionals: Professional[]; categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Professional | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return professionals.filter((p) => {
      if (catFilter !== "all" && p.categoryId !== catFilter) return false;
      if (!q) return true;
      return p.user.name.toLowerCase().includes(q) || p.user.email.toLowerCase().includes(q);
    });
  }, [professionals, query, catFilter]);

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-[15px] font-extrabold text-[#1A1D2E]">Profesionales activos</h2>
        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-extrabold">{filtered.length}/{professionals.length}</span>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-[13px] font-medium text-[#1A1D2E] placeholder:text-gray-400 focus:outline-none focus:border-[#5C80BC]"
        />
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-[13px] font-medium text-[#1A1D2E] focus:outline-none focus:border-[#5C80BC]"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 text-center text-[12px] text-gray-500">Sin resultados</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {filtered.map((p) => (
            <div key={p.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white text-sm font-black shrink-0">
                  {p.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-[#1A1D2E] truncate">{p.user.name}</div>
                  <div className="text-[11px] text-gray-400 truncate">{p.category.icon} {p.category.name} · {p.user.email}</div>
                </div>
                <TierSelect profileId={p.id} currentTier={p.tier || "FREE"} />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEditing(p)} className="flex-1 py-2 rounded-lg bg-[#5C80BC]/10 border border-[#5C80BC]/30 text-center text-[11px] font-bold text-[#5C80BC] active:scale-[0.97]">Editar</button>
                <Link href={`/app/profesional/${p.slug}`} className="flex-1 py-2 rounded-lg bg-gray-50 border border-gray-200 text-center text-[11px] font-bold text-[#1A1D2E]">Ver</Link>
                <SuspendButton profileId={p.id} />
                <DeleteProfessionalButton profileId={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <EditModal professional={editing} categories={categories} onClose={() => setEditing(null)} />}
    </section>
  );
}

function EditModal({ professional, categories, onClose }: { professional: Professional; categories: Category[]; onClose: () => void }) {
  const [name, setName] = useState(professional.user.name);
  const [email, setEmail] = useState(professional.user.email);
  const [phone, setPhone] = useState(professional.user.phone ?? "");
  const [city, setCity] = useState(professional.city);
  const [categoryId, setCategoryId] = useState(professional.categoryId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/professionals/${professional.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, city, categoryId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al guardar");
      }
      window.location.reload();
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-2xl p-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-extrabold text-[#1A1D2E]">Editar profesional</h3>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">×</button>
        </div>

        <div className="space-y-3">
          <Field label="Nombre" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <Field label="Teléfono" value={phone} onChange={setPhone} />
          <Field label="Ciudad" value={city} onChange={setCity} />
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Categoría</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-[13px] font-medium text-[#1A1D2E]">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="mt-3 p-2.5 rounded-lg bg-red-50 text-[12px] text-red-600 font-semibold">{error}</div>}

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-[13px] font-bold text-[#1A1D2E]">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#5C80BC] text-[13px] font-bold text-white disabled:opacity-50">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-[10px] font-bold text-gray-400 uppercase">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-[13px] font-medium text-[#1A1D2E] focus:outline-none focus:border-[#5C80BC]" />
    </div>
  );
}