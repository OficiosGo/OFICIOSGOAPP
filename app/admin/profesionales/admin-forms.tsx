"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSponsor, deleteSponsor, changeTier } from "@/server/actions/admin.actions";

export function AddSponsorForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setError("");
    setLoading(true);
    const result = await createSponsor(formData);
    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      setError(result.error || "Error");
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="w-full py-3 rounded-xl border-2 border-dashed border-[#F8C927]/40 text-[13px] font-bold text-[#F8C927] active:scale-[0.98] transition-transform">
        + Agregar sponsor
      </button>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-extrabold text-[#1A1D2E]">Nuevo sponsor</h3>
        <button onClick={() => setOpen(false)} className="text-xs text-gray-400">Cancelar</button>
      </div>
      {error && <div className="p-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium mb-3">{error}</div>}
      <form action={handleSubmit} className="space-y-3">
        <input name="name" required placeholder="Nombre del negocio" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927]" />
        <input name="description" required placeholder="Descripción corta" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927]" />
        <input name="logoUrl" placeholder="URL del logo (subir a imgbb.com y pegar link)" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927]" />
        <div className="grid grid-cols-2 gap-2">
          <input name="phone" placeholder="Teléfono" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927]" />
          <input name="whatsapp" placeholder="WhatsApp (54...)" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927]" />
        </div>
        <select name="tier" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927] bg-white">
          <option value="STANDARD">Sponsor Standard</option>
          <option value="PREMIUM">★ Premium Partner</option>
        </select>
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-sm disabled:opacity-50 active:scale-[0.98] transition-transform">
          {loading ? "Guardando..." : "Crear sponsor"}
        </button>
      </form>
    </div>
  );
}

export function DeleteSponsorButton({ sponsorId }: { sponsorId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este sponsor?")) return;
    setLoading(true);
    await deleteSponsor(sponsorId);
    router.refresh();
    setLoading(false);
  };

  return (
    <button onClick={handleDelete} disabled={loading} className="text-[11px] font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg active:scale-95 transition-transform disabled:opacity-50">
      {loading ? "..." : "Eliminar"}
    </button>
  );
}

export function TierSelect({ profileId, currentTier }: { profileId: string; currentTier: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    await changeTier(profileId, e.target.value);
    router.refresh();
    setLoading(false);
  };

  return (
    <select value={currentTier} onChange={handleChange} disabled={loading} className={`text-[11px] font-extrabold px-2 py-1 rounded-lg outline-none cursor-pointer disabled:opacity-50 ${currentTier === "PREMIUM" ? "bg-[#F8C927] text-[#1A1D2E]" : currentTier === "STANDARD" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
      <option value="FREE">Free</option>
      <option value="STANDARD">Standard</option>
      <option value="PREMIUM">★ Premium</option>
    </select>
  );
}