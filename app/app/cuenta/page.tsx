import Link from "next/link";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { InstallButton } from "@/components/pwa/install-button";

export default async function CuentaPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <div className="bg-[#1A1D2E] px-5 pt-4 pb-8 rounded-b-[28px] text-center">
          <h1 className="text-xl font-black text-[#F8C927] mb-6">Mi Cuenta</h1>
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
          </div>
          <p className="text-sm text-gray-400 mb-4">Inicia sesion para ver tu cuenta</p>
          <Link href="/login" className="inline-block px-8 py-3 rounded-xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-sm">Ingresar</Link>
          <div className="mt-3">
            <Link href="/registro" className="text-xs text-gray-400 hover:text-white">No tenes cuenta? Registrate gratis</Link>
          </div>
        </div>
      </>
    );
  }

  const profile = await professionalRepository.getByUserId(user.id);
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  const profileImg = profile ? (profile as any).profileImage : null;
  const isPro = user.role === "PROFESSIONAL" && profile;

  return (
    <>
      {/* Header */}
      <div className="bg-[#1A1D2E] px-5 pt-4 pb-8 rounded-b-[28px] text-center">
        <h1 className="text-xl font-black text-[#F8C927] mb-4">Mi Cuenta</h1>
        <div className="w-[76px] h-[76px] rounded-full overflow-hidden bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-2xl font-black text-white mx-auto mb-2 border-[3px] border-[#F8C927]/30">
          {profileImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profileImg} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="text-base font-extrabold text-white">{user.name}</div>
        <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
        {profile && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
              profile.tier === "PREMIUM" ? "bg-[#F8C927] text-[#1A1D2E]" : profile.tier === "STANDARD" ? "bg-[#5C80BC] text-white" : "bg-white/20 text-white"
            }`}>{profile.tier === "FREE" ? "Plan Gratuito" : profile.tier}</span>
            {(profile as any).urgencias24hs && (
              <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-full bg-red-500 text-white uppercase">24hs</span>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-4 pb-24 flex flex-col gap-2">
        {/* Install button */}
        <InstallButton variant="full" />

        {/* Professional menu */}
        {isPro && (
          <>
            <Link href="/app/cuenta/editar" className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-[#1A1D2E]">
              <span className="text-lg">✏️</span>
              <div className="flex-1">
                <div>Editar perfil</div>
                <div className="text-[11px] text-gray-400 font-normal mt-0.5">Descripcion, WhatsApp, disponibilidad</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </Link>

            <Link href="/app/cuenta/fotos" className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-[#1A1D2E]">
              <span className="text-lg">📸</span>
              <div className="flex-1">
                <div>Mis fotos de trabajo</div>
                <div className="text-[11px] text-gray-400 font-normal mt-0.5">Subi fotos para mostrar tu trabajo</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </Link>

            <Link href="/app/cuenta/resenas" className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-[#1A1D2E]">
              <span className="text-lg">⭐</span>
              <div className="flex-1">
                <div>Mis resenas</div>
                <div className="text-[11px] text-gray-400 font-normal mt-0.5">{profile.totalReviews} resena{profile.totalReviews !== 1 ? "s" : ""} - {profile.averageRating.toFixed(1)} promedio</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </Link>

            <Link href="/app/cuenta/estadisticas" className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-[#1A1D2E]">
              <span className="text-lg">📊</span>
              <div className="flex-1">
                <div>Estadisticas</div>
                <div className="text-[11px] text-gray-400 font-normal mt-0.5">{profile.totalViews} visitas - {profile.totalContacts} contactos</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </Link>

            <Link href={`/app/profesional/${profile.slug}`} className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-[#1A1D2E]">
              <span className="text-lg">👁️</span>
              <div className="flex-1">
                <div>Ver mi perfil publico</div>
                <div className="text-[11px] text-gray-400 font-normal mt-0.5">Lo que ven los clientes</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </Link>

            <Link href="/app/dashboard" className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-[#1A1D2E] border border-[#F8C927]/20 text-sm font-semibold text-[#F8C927]">
              <span className="text-lg">📋</span>
              <div className="flex-1">
                <div>Panel de control</div>
                <div className="text-[11px] text-gray-500 font-normal mt-0.5">Presupuestos, metricas y resenas</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </>
        )}

        {/* Logout */}
        <form action="/api/auth/logout" method="POST" className="mt-2">
          <button type="submit" className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-red-100 text-sm font-semibold text-red-500">
            <span className="text-lg">🚪</span>
            Cerrar sesion
          </button>
        </form>
      </div>
    </>
  );
}