"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProfilePhotoUpload } from "@/components/features/profile-photo-upload";

export default function EditarPerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [form, setForm] = useState({
    headline: "",
    bio: "",
    whatsapp: "",
    yearsExperience: "",
    city: "",
    neighborhood: "",
    availability: "",
    matricula: "",
  });

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(async (data) => {
      if (!data.data) { router.push("/login"); return; }
      setUserName(data.data.name);
      const res = await fetch(`/api/professionals/${data.data.id}`);
      const pData = await res.json();
      if (pData.data) {
        const p = pData.data;
        setProfile(p);
        setForm({
          headline: p.headline || "",
          bio: p.bio || "",
          whatsapp: p.whatsapp || "",
          yearsExperience: p.yearsExperience?.toString() || "",
          city: p.city || "",
          neighborhood: p.neighborhood || "",
          availability: p.availability || "",
          matricula: p.matricula || "",
        });
      }
      setLoading(false);
    }).catch(() => { router.push("/login"); });
  }, [router]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setError(""); setSuccess(false); setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });

      const res = await fetch("/api/profile/update", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al guardar"); return; }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Error de conexion");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20";
  const labelStyle = "block text-sm font-semibold text-[#1A1D2E] mb-1.5";

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-3 border-[#F8C927] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <>
      <div className="bg-[#1A1D2E] px-5 pt-4 pb-5 rounded-b-[20px]">
        <div className="flex items-center gap-3">
          <Link href="/app/cuenta" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h1 className="text-lg font-black text-[#F8C927]">Editar perfil</h1>
        </div>
      </div>

      <div className="px-4 py-5 pb-24">
        {/* Photo */}
        <div className="flex justify-center mb-6">
          <ProfilePhotoUpload currentImage={profile?.profileImage} userName={userName} />
        </div>

        {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 mb-4">{error}</div>}
        {success && <div className="p-3 rounded-xl bg-green-50 text-green-600 text-sm font-medium border border-green-100 mb-4">Perfil actualizado correctamente</div>}

        <div className="space-y-4">
          <div>
            <label className={labelStyle}>Titular / Descripcion corta</label>
            <input value={form.headline} onChange={set("headline")} placeholder="Ej: Electricista matriculado - 12 años de experiencia" className={inputStyle} />
            <p className="text-[11px] text-gray-400 mt-1">{form.headline.length}/120</p>
          </div>

          <div>
            <label className={labelStyle}>Biografia</label>
            <textarea value={form.bio} onChange={set("bio")} rows={4} placeholder="Conta sobre tu experiencia, servicios y zona de trabajo..." className={inputStyle + " resize-none"} />
          </div>

          <div>
            <label className={labelStyle}>WhatsApp</label>
            <input value={form.whatsapp} onChange={set("whatsapp")} placeholder="5493535698990" inputMode="numeric" className={inputStyle} />
            <p className="text-[11px] text-gray-400 mt-1">Con codigo de area y pais (54)</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelStyle}>Años de experiencia</label>
              <input type="number" value={form.yearsExperience} onChange={set("yearsExperience")} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Matricula</label>
              <input value={form.matricula} onChange={set("matricula")} placeholder="Opcional" className={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelStyle}>Ciudad</label>
              <input value={form.city} onChange={set("city")} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Barrio</label>
              <input value={form.neighborhood} onChange={set("neighborhood")} placeholder="Opcional" className={inputStyle} />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Disponibilidad</label>
            <input value={form.availability} onChange={set("availability")} placeholder="Ej: Lunes a sabado 8:00-18:00" className={inputStyle} />
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full py-4 rounded-2xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-[15px] disabled:opacity-60 mt-2">
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </>
  );
}