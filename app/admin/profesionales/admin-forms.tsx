"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSponsor, deleteSponsor, changeTier, deleteProfessional } from "@/server/actions/admin.actions";

export function AddSponsorForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Máximo 2MB"); return; }

    setError("");
    setLogoPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.data?.url) {
        setLogoUrl(data.data.url);
      } else {
        setError(data.error || "Error al subir logo");
        setLogoPreview(null);
      }
    } catch {
      setError("Error de conexión");
      setLogoPreview(null);
    }
    setLoading(false);
  };

  const handleSubmit = async (formData: FormData) => {
    setError("");
    setLoading(true);
    if (logoUrl) formData.set("logoUrl", logoUrl);
    const result = await createSponsor(formData);
    if (result.success) {
      setOpen(false);
      setLogoPreview(null);
      setLogoUrl("");
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
        <button onClick={() => { setOpen(false); setLogoPreview(null); setLogoUrl(""); }} className="text-xs text-gray-400">Cancelar</button>
      </div>
      {error && <div className="p-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium mb-3">{error}</div>}
      <form action={handleSubmit} className="space-y-3">
        <input name="name" required placeholder="Nombre del negocio" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927]" />
        <input name="description" required placeholder="Descripción corta" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#F8C927]" />
        <div>
          <label className="block text-[12px] font-semibold text-[#1A1D2E] mb-1.5">Logo del negocio</label>
          <div className="flex items-center gap-3">
            <div onClick={() => fileRef.current?.click()} className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 active:scale-95 transition-transform">
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <span className="text-lg">📷</span>
                  <div className="text-[8px] text-gray-400 mt-0.5">Subir</div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <button type="button" onClick={() => fileRef.current?.click()} className="text-[12px] font-bold text-[#5C80BC]">
                {logoPreview ? "Cambiar imagen" : "Elegir imagen"}
              </button>
              <p className="text-[10px] text-gray-400 mt-0.5">PNG o JPG, máximo 2MB</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" />
          <input type="hidden" name="logoUrl" value={logoUrl} />
        </div>
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

export function DeleteProfessionalButton({ profileId }: { profileId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este profesional? Se borra la cuenta, perfil, opiniones y fotos. Esta acción no se puede deshacer.")) return;
    setLoading(true);
    const result = await deleteProfessional(profileId);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <button onClick={handleDelete} disabled={loading} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-[11px] font-bold active:scale-[0.97] transition-transform disabled:opacity-50">
      {loading ? "..." : "🗑 Eliminar"}
    </button>
  );
}