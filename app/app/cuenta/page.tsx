import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { budgetRepository } from "@/server/repositories/budget.repository";
import { db } from "@/db/client";
import { InstallButton } from "@/components/pwa/install-button";
import { UpgradePlan } from "@/components/features/upgrade-plan";

export const dynamic = "force-dynamic";

function pluralize(n: number, singular: string, plural: string) {
  return n === 1 ? singular : plural;
}

function cleanPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  // If already starts with 54 (Argentina), return as-is
  if (digits.startsWith("54")) return digits;
  // Otherwise prepend 54
  return `54${digits}`;
}

export default async function CuentaPage() {
  const user = await getCurrentUser();

  // ─────────────────────────────────────────
  // VISTA 1: NO LOGUEADO
  // ─────────────────────────────────────────
  if (!user) {
    return (
      <>
        <div className="bg-[#1A1D2E] px-5 pt-4 pb-10 rounded-b-[28px] text-center">
          <h1 className="text-xl font-black text-[#F8C927] mb-6">Mi Cuenta</h1>
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
            </svg>
          </div>
          <p className="text-sm text-gray-300 mb-5">Iniciá sesión para ver tu cuenta</p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 rounded-xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-sm active:scale-[0.97] transition-transform"
          >
            Ingresar
          </Link>
          <div className="mt-3">
            <Link href="/registro" className="text-xs text-gray-400 hover:text-white">
              ¿No tenés cuenta? Registrate gratis
            </Link>
          </div>
        </div>

        <div className="px-4 py-6 pb-24 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="text-2xl mb-2">🛠️</div>
            <h3 className="text-[15px] font-extrabold text-[#1A1D2E] mb-1">
              ¿Sos profesional?
            </h3>
            <p className="text-[12px] text-gray-500 leading-relaxed mb-3">
              Sumate gratis a OficiosGo! y empezá a recibir clientes en Villa María y Villa Nueva.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-[#1A1D2E] bg-[#F8C927] px-4 py-2 rounded-lg active:scale-[0.97] transition-transform"
            >
              Registrarme gratis →
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────
  // VISTA 2: ADMIN
  // ─────────────────────────────────────────
  if (user.role === "ADMIN") {
    const [totalProfiles, pendingProfiles, totalReviews] = await Promise.all([
      db.profile.count(),
      db.profile.count({ where: { status: "PENDING" } }),
      db.review.count({ where: { isVisible: true, deletedAt: null } }),
    ]);

    const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

    return (
      <>
        <div className="bg-[#1A1D2E] px-5 pt-4 pb-8 rounded-b-[28px] text-center">
          <h1 className="text-xl font-black text-[#F8C927] mb-4">Mi Cuenta</h1>
          <div className="w-[76px] h-[76px] rounded-full bg-gradient-to-br from-[#BC5C80] to-[#963a5a] flex items-center justify-center text-2xl font-black text-white mx-auto mb-2 border-[3px] border-[#F8C927]/30">
            {initials}
          </div>
          <div className="text-base font-extrabold text-white">{user.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
          <span className="inline-block mt-2 text-[9px] font-extrabold px-2.5 py-1 rounded-full bg-[#F8C927] text-[#1A1D2E] uppercase">
            ★ Administrador
          </span>
        </div>

        <div className="px-4 py-4 pb-24 space-y-3">
          {/* Admin stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-white border border-gray-100 text-center">
              <div className="text-[20px] font-black text-[#1A1D2E]">{totalProfiles}</div>
              <div className="text-[10px] text-gray-400 font-medium">Profesionales</div>
            </div>
            <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-center">
              <div className="text-[20px] font-black text-yellow-700">{pendingProfiles}</div>
              <div className="text-[10px] text-yellow-600 font-medium">Pendientes</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-gray-100 text-center">
              <div className="text-[20px] font-black text-[#1A1D2E]">{totalReviews}</div>
              <div className="text-[10px] text-gray-400 font-medium">Opiniones</div>
            </div>
          </div>

          {/* Admin actions */}
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-[#1A1D2E] border border-[#F8C927]/30 text-sm font-semibold text-[#F8C927]"
          >
            <span className="text-lg">🛡️</span>
            <div className="flex-1">
              <div>Panel de Administración</div>
              <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                Gestionar profesionales y contenido
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>

          <Link
            href="/admin/profesionales"
            className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-[#1A1D2E]"
          >
            <span className="text-lg">👥</span>
            <div className="flex-1">
              <div>Aprobar profesionales</div>
              <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                {pendingProfiles} {pluralize(pendingProfiles, "pendiente", "pendientes")} de revisión
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>

          <InstallButton variant="full" />

          <form action="/api/auth/logout" method="POST" className="mt-2">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-red-100 text-sm font-semibold text-red-500"
            >
              <span className="text-lg">🚪</span>
              Cerrar sesión
            </button>
          </form>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────
  // VISTA 3: PROFESIONAL
  // ─────────────────────────────────────────
  if (user.role === "PROFESSIONAL") {
    const profile = await professionalRepository.getByUserId(user.id);

    // Si es PROFESSIONAL pero todavía no creó perfil → mostrarle CTA
    if (!profile) {
      const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
      return (
        <>
          <div className="bg-[#1A1D2E] px-5 pt-4 pb-8 rounded-b-[28px] text-center">
            <h1 className="text-xl font-black text-[#F8C927] mb-4">Mi Cuenta</h1>
            <div className="w-[76px] h-[76px] rounded-full bg-gradient-to-br from-[#5C80BC] to-[#3a5a96] flex items-center justify-center text-2xl font-black text-white mx-auto mb-2 border-[3px] border-[#F8C927]/30">
              {initials}
            </div>
            <div className="text-base font-extrabold text-white">{user.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
          </div>

          <div className="px-4 py-6 pb-24 space-y-3">
            <div className="p-5 rounded-2xl bg-white border-2 border-[#F8C927]/40 shadow-sm">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="text-[15px] font-extrabold text-[#1A1D2E] mb-1">
                Completá tu perfil profesional
              </h3>
              <p className="text-[12px] text-gray-500 leading-relaxed mb-3">
                Subí tus datos, fotos y empezá a recibir clientes en Villa María.
              </p>
              <Link
                href="/app/cuenta/editar"
                className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-[#1A1D2E] bg-[#F8C927] px-4 py-2 rounded-lg active:scale-[0.97] transition-transform"
              >
                Crear mi perfil →
              </Link>
            </div>

            <InstallButton variant="full" />

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-red-100 text-sm font-semibold text-red-500"
              >
                <span className="text-lg">🚪</span>
                Cerrar sesión
              </button>
            </form>
          </div>
        </>
      );
    }

    // Profesional con perfil completo
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentEvents, recentReviews, budgetRequests] = await Promise.all([
      db.profileEvent.groupBy({
        by: ["eventType"],
        where: { profileId: profile.id, createdAt: { gte: thirtyDaysAgo } },
        _count: true,
      }),
      db.review.findMany({
        where: { profileId: profile.id, isVisible: true, deletedAt: null },
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      budgetRepository.getForProfessional(profile.categoryId, 1, 5),
    ]);

    const recentViews = recentEvents.find((e) => e.eventType === "view")?._count ?? 0;
    const recentContacts = recentEvents.find((e) => e.eventType === "contact")?._count ?? 0;
    const conversionRate =
      recentViews > 0 ? ((recentContacts / recentViews) * 100).toFixed(1) : "0";

    const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
    const profileImg = (profile as any).profileImage;

    const metrics = [
      { label: "Vistas", value: profile.totalViews, recent: recentViews, icon: "👁" },
      { label: "Contactos", value: profile.totalContacts, recent: recentContacts, icon: "📞" },
      { label: "Rating", value: profile.averageRating.toFixed(1), recent: null, icon: "⭐" },
      { label: "Opiniones", value: profile.totalReviews, recent: null, icon: "💬" },
    ];

    return (
      <>
        {/* ── HEADER ── */}
        <div
          className="px-5 pt-5 pb-6 rounded-b-[28px]"
          style={{ background: "linear-gradient(175deg, #0F1120 0%, #1E2035 100%)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-[18px] font-black text-[#F8C927]">Mi Cuenta</h1>
            {(profile.tier === "PREMIUM" || profile.tier === "STANDARD") && (
              <span
                className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                  profile.tier === "PREMIUM"
                    ? "bg-[#F8C927] text-[#1A1D2E]"
                    : "bg-[#5C80BC] text-white"
                }`}
              >
                {profile.tier === "PREMIUM" ? "★ Premium" : "Standard"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="w-[64px] h-[64px] rounded-full overflow-hidden bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-xl font-black text-white border-[3px] border-[#F8C927]/30 shrink-0">
              {profileImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profileImg} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-extrabold text-white truncate">{user.name}</div>
              <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
              {profile.status === "PENDING" && (
                <span className="inline-block mt-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 uppercase">
                  ⏳ Pendiente
                </span>
              )}
            </div>
          </div>

          <p className="text-[12px] text-gray-400 mt-4 mb-2 font-medium">
            Así va tu perfil este mes
          </p>

          {/* Metrics grid */}
          <div className="grid grid-cols-4 gap-2">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-center"
              >
                <span className="text-base">{m.icon}</span>
                <div className="text-[17px] font-black text-white mt-0.5">{m.value}</div>
                <div className="text-[9px] text-gray-400 font-medium">{m.label}</div>
                {m.recent !== null && m.recent > 0 && (
                  <div className="text-[9px] text-[#F8C927] font-bold mt-0.5">
                    +{m.recent} mes
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Conversion rate */}
          <div className="mt-3 p-3 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[11px] text-gray-400">Tasa de conversión</div>
              <div className="text-[12px] font-bold text-white truncate">
                De cada 100 visitas, {Math.round(parseFloat(conversionRate))} te contactan
              </div>
            </div>
            <div className="text-xl font-black text-[#F8C927] shrink-0 ml-2">
              {conversionRate}%
            </div>
          </div>
        </div>

        <div className="px-4 py-4 pb-28 space-y-3">
          {/* Status banner */}
          {profile.status === "PENDING" && (
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">⏳</span>
                <span className="text-[13px] font-bold text-yellow-800">
                  Perfil pendiente de aprobación
                </span>
              </div>
              <p className="text-[12px] text-yellow-700">
                Un administrador lo va a revisar pronto. Mientras tanto, completá tu información
                y subí fotos.
              </p>
            </div>
          )}

          {/* Subscription plan */}
          <UpgradePlan currentTier={profile.tier} professionalName={user.name} />

          {/* Budget requests */}
          {budgetRequests.data.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border-2 border-[#F8C927]/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-extrabold text-[#1A1D2E] flex items-center gap-2">
                  📋 Pedidos de presupuesto
                  <span className="px-2 py-0.5 rounded-full bg-[#F8C927] text-[#1A1D2E] text-[10px] font-extrabold">
                    {budgetRequests.total}
                  </span>
                </h3>
              </div>
              <div className="space-y-2.5">
                {budgetRequests.data.map((req) => {
                  const cleanedPhone = cleanPhone(req.clientPhone);
                  const waText = encodeURIComponent(
                    `Hola ${req.clientName ?? ""}, soy ${user.name} de OficiosGo! Vi tu pedido y me gustaría ayudarte.`
                  );
                  return (
                    <div
                      key={req.id}
                      className="p-3 rounded-xl bg-[#FFFCF0] border border-yellow-100"
                    >
                      <p className="text-[13px] font-bold text-[#1A1D2E] line-clamp-2">
                        {req.description}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {new Date(req.createdAt).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {cleanedPhone && (
                        <Link
                          href={`https://wa.me/${cleanedPhone}?text=${waText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#25D366] text-white text-[12px] font-bold active:scale-[0.98] transition-transform"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Contactar por WhatsApp
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent reviews */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100">
            <h3 className="text-[14px] font-extrabold text-[#1A1D2E] mb-3">
              Últimas opiniones
            </h3>
            {recentReviews.length === 0 ? (
              <p className="text-[13px] text-gray-400 py-3">
                Todavía no recibiste opiniones
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentReviews.map((rev) => (
                  <div key={rev.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#1A1D2E]">
                        {rev.author.name}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`text-[11px] ${
                              s <= rev.rating ? "text-[#F8C927]" : "text-gray-200"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">
                        {rev.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/app/cuenta/editar"
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-white border border-gray-100 text-[13px] font-bold text-[#1A1D2E] active:scale-[0.97] transition-transform"
            >
              <span className="text-base">✏️</span>
              Editar perfil
            </Link>
            <Link
              href="/app/cuenta/fotos"
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-white border border-gray-100 text-[13px] font-bold text-[#1A1D2E] active:scale-[0.97] transition-transform"
            >
              <span className="text-base">📸</span>
              Mis fotos
            </Link>
            <Link
              href="/app/cuenta/opiniones"
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-white border border-gray-100 text-[13px] font-bold text-[#1A1D2E] active:scale-[0.97] transition-transform"
            >
              <span className="text-base">💬</span>
              Mis opiniones
            </Link>
            <Link
              href={`/app/profesional/${profile.slug}`}
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-white border border-gray-100 text-[13px] font-bold text-[#1A1D2E] active:scale-[0.97] transition-transform"
            >
              <span className="text-base">👁️</span>
              Ver mi perfil
            </Link>
          </div>

          {/* Install PWA */}
          <InstallButton variant="full" />

          {/* Logout */}
          <form action="/api/auth/logout" method="POST" className="mt-2">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-red-100 text-sm font-semibold text-red-500"
            >
              <span className="text-lg">🚪</span>
              Cerrar sesión
            </button>
          </form>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────
  // VISTA 4: CLIENTE
  // ─────────────────────────────────────────
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <>
      <div className="bg-[#1A1D2E] px-5 pt-4 pb-8 rounded-b-[28px] text-center">
        <h1 className="text-xl font-black text-[#F8C927] mb-4">Mi Cuenta</h1>
        <div className="w-[76px] h-[76px] rounded-full bg-gradient-to-br from-[#5C80BC] to-[#3a5a96] flex items-center justify-center text-2xl font-black text-white mx-auto mb-2 border-[3px] border-[#F8C927]/30">
          {initials}
        </div>
        <div className="text-base font-extrabold text-white">{user.name}</div>
        <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
        <span className="inline-block mt-2 text-[9px] font-extrabold px-2.5 py-1 rounded-full bg-[#5C80BC] text-white uppercase">
          Cliente
        </span>
      </div>

      <div className="px-4 py-4 pb-24 space-y-3">
        {/* CTA principal: buscar */}
        <Link
          href="/app/buscar"
          className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-[#F8C927] text-[#1A1D2E] text-sm font-extrabold active:scale-[0.97] transition-transform"
        >
          <span className="text-lg">🔍</span>
          <div className="flex-1">
            <div>Buscar profesionales</div>
            <div className="text-[11px] font-semibold opacity-70 mt-0.5">
              Plomeros, electricistas, pintores y más
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1D2E" strokeWidth="2.5">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>

        {/* Convertirse en profesional */}
        <Link
          href="/registro"
          className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border-2 border-[#F8C927]/40 text-sm font-semibold text-[#1A1D2E]"
        >
          <span className="text-lg">🛠️</span>
          <div className="flex-1">
            <div>¿Sos profesional?</div>
            <div className="text-[11px] text-gray-400 font-normal mt-0.5">
              Sumate gratis y recibí clientes
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>

        <InstallButton variant="full" />

        {/* Logout */}
        <form action="/api/auth/logout" method="POST" className="mt-2">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-red-100 text-sm font-semibold text-red-500"
          >
            <span className="text-lg">🚪</span>
            Cerrar sesión
          </button>
        </form>
      </div>
    </>
  );
}