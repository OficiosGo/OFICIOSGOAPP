import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";

export default async function CuentaPage() {
  const user = await getCurrentUser();

  // Not logged in → show login prompt
  if (!user) {
    return (
      <>
        <div className="bg-[#1A1D2E] px-5 pt-4 pb-8 rounded-b-[28px] text-center">
          <h1 className="text-xl font-black text-[#F8C927] mb-6">Mi Cuenta</h1>
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
          </div>
          <p className="text-sm text-gray-400 mb-4">Iniciá sesión para ver tu cuenta</p>
          <Link href="/app/login" className="inline-block px-8 py-3 rounded-xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-sm">
            Ingresar
          </Link>
        </div>
      </>
    );
  }

  const profile = await professionalRepository.getByUserId(user.id);

  const menuItems = [
    { icon: "✏️", label: "Editar perfil", href: "/dashboard" },
    { icon: "📸", label: "Mis fotos de trabajo", href: "/dashboard" },
    { icon: "⭐", label: "Mis reseñas", href: "/dashboard" },
    { icon: "📊", label: "Estadísticas", href: "/dashboard" },
    { icon: "💎", label: "Plan Premium", href: "/dashboard" },
    { icon: "⚙️", label: "Configuración", href: "/dashboard" },
  ];

  return (
    <>
      <div className="bg-[#1A1D2E] px-5 pt-4 pb-8 rounded-b-[28px] text-center">
        <h1 className="text-xl font-black text-[#F8C927] mb-4">Mi Cuenta</h1>
        <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-2xl font-black text-white mx-auto mb-2">
          {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div className="text-base font-extrabold text-white">{user.name}</div>
        <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
        {profile && (
          <div className="mt-2">
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
              profile.tier === "PREMIUM" ? "bg-[#F8C927] text-[#1A1D2E]" : profile.tier === "STANDARD" ? "bg-[#5C80BC] text-white" : "bg-white/20 text-white"
            }`}>{profile.tier}</span>
          </div>
        )}
      </div>

      <div className="px-4 py-4 pb-24 flex flex-col gap-2">
        {menuItems.map(item => (
          <Link key={item.label} href={item.href}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-[#1A1D2E]">
            <span className="text-lg">{item.icon}</span>
            {item.label}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="ml-auto"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        ))}

        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-red-100 text-sm font-semibold text-red-500 mt-2">
            <span className="text-lg">🚪</span>
            Cerrar sesión
          </button>
        </form>
      </div>

    </>
  );
}
