import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { budgetRepository } from "@/server/repositories/budget.repository";
import { db } from "@/db/client";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await professionalRepository.getByUserId(user.id);
  if (!profile) redirect("/login");

  // Get recent events for metrics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentEvents = await db.profileEvent.groupBy({
    by: ["eventType"],
    where: { profileId: profile.id, createdAt: { gte: thirtyDaysAgo } },
    _count: true,
  });

  const recentViews = recentEvents.find((e) => e.eventType === "view")?._count ?? 0;
  const recentContacts = recentEvents.find((e) => e.eventType === "contact")?._count ?? 0;

  const recentReviews = await db.review.findMany({
    where: { profileId: profile.id, isVisible: true, deletedAt: null },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Get incoming budget requests for this professional's category
  const budgetRequests = await budgetRepository.getForProfessional(profile.categoryId, 1, 5);

  const isPremium = profile.tier === "PREMIUM";

  const metrics = [
    { label: "Vistas totales", value: profile.totalViews, recent: recentViews, color: "text-brand-blue", bg: "bg-blue-50" },
    { label: "Contactos totales", value: profile.totalContacts, recent: recentContacts, color: "text-green-600", bg: "bg-green-50" },
    { label: "Rating promedio", value: profile.averageRating.toFixed(1), recent: null, color: "text-brand-gold", bg: "bg-yellow-50" },
    { label: "Reseñas totales", value: profile.totalReviews, recent: null, color: "text-brand-olive", bg: "bg-emerald-50" },
  ];

  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-black text-brand-black">
                Hola, {user.name.split(" ")[0]} 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">Así va tu perfil este mes</p>
            </div>
            {(isPremium || profile.tier === "STANDARD") && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                isPremium ? "bg-gradient-to-r from-brand-gold to-yellow-400 text-brand-black" : "bg-brand-blue text-white"
              }`}>
                {isPremium ? "★ Premium" : "Standard"}
              </span>
            )}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {metrics.map((m) => (
              <div key={m.label} className="p-5 rounded-2xl bg-white border border-gray-200">
                <div className={`w-9 h-9 rounded-xl ${m.bg} flex items-center justify-center ${m.color} text-lg font-bold mb-3`}>
                  {m.label.includes("Vistas") ? "👁" : m.label.includes("Contacto") ? "📞" : m.label.includes("Rating") ? "⭐" : "💬"}
                </div>
                <div className="text-2xl font-black text-brand-black">{m.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.label}</div>
                {m.recent !== null && (
                  <div className="text-xs text-brand-olive font-semibold mt-1">+{m.recent} este mes</div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Subscription card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-black to-gray-800 text-white">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-extrabold">Plan {profile.tier === "FREE" ? "Gratuito" : profile.tier}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {profile.tier === "FREE"
                      ? "Upgrade a Premium para aparecer primero"
                      : "Tu perfil aparece destacado en búsquedas"}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  profile.tier === "FREE" ? "bg-gray-600 text-gray-300" : "bg-brand-gold text-brand-black"
                }`}>
                  {profile.tier === "FREE" ? "Free" : "Activo"}
                </span>
              </div>

              {profile.tier === "FREE" && (
                <button className="w-full py-3 rounded-xl bg-brand-yellow text-brand-black font-bold text-sm hover:bg-yellow-300 transition-colors">
                  Upgrade a Premium — $4.990/mes
                </button>
              )}

              {profile.tier !== "FREE" && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-xs text-gray-400">Posición en búsqueda</div>
                    <div className="text-sm font-bold mt-0.5">Top {isPremium ? "3" : "10"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Badge</div>
                    <div className="text-sm font-bold mt-0.5">{isPremium ? "★ Premium" : "Standard"}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent reviews */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200">
              <h3 className="text-lg font-extrabold text-brand-black mb-4">Últimas reseñas</h3>
              {recentReviews.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">Todavía no recibiste reseñas</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentReviews.map((rev) => (
                    <div key={rev.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{rev.author.name}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className={`text-xs ${s <= rev.rating ? "text-brand-gold" : "text-gray-300"}`}>★</span>
                          ))}
                        </div>
                      </div>
                      {rev.comment && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{rev.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">

          {/* ── Budget Requests ── */}
          {budgetRequests.data.length > 0 && (
            <div className="col-span-full mb-2">
              <div className="p-6 rounded-2xl bg-white border-2 border-[#F8C927]/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-extrabold text-brand-black flex items-center gap-2">
                    📋 Pedidos de presupuesto
                    <span className="px-2 py-0.5 rounded-full bg-[#F8C927] text-[#1A1D2E] text-xs font-extrabold">{budgetRequests.total}</span>
                  </h3>
                </div>
                <div className="space-y-3">
                  {budgetRequests.data.map((req) => (
                    <div key={req.id} className="p-4 rounded-xl bg-yellow-50/50 border border-yellow-100">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#1A1D2E] line-clamp-2">{req.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(req.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            {" · "}{req._count.responses} respuesta{req._count.responses !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          req.status === "PENDING" ? "bg-yellow-200 text-yellow-800" : "bg-green-100 text-green-700"
                        }`}>
                          {req.status === "PENDING" ? "Nuevo" : "Activo"}
                        </span>
                      </div>
                      <a
                        href={`https://wa.me/54${req.clientPhone ?? ""}?text=${encodeURIComponent(`Hola ${req.clientName ?? ""}, soy ${user.name} de OficiosGo! Vi tu pedido de presupuesto y me gustaría ayudarte.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Contactar cliente por WhatsApp
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
            {[
              { label: "Editar perfil", emoji: "✏️", href: "#" },
              { label: "Subir fotos", emoji: "📸", href: "#" },
              { label: "Responder reseñas", emoji: "💬", href: "#" },
              { label: "Ver perfil público", emoji: "👁️", href: `/app/profesional/${profile.slug}` },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-2.5 px-4 py-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-brand-black hover:border-brand-yellow hover:shadow-sm transition-all"
              >
                <span className="text-lg">{a.emoji}</span>
                {a.label}
              </Link>
            ))}
          </div>

          {/* Profile status banner */}
          {profile.status === "PENDING" && (
            <div className="mt-5 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
              <strong>Tu perfil está pendiente de aprobación.</strong> Un administrador lo revisará pronto. Mientras tanto, completá tu información y subí fotos de tus trabajos.
            </div>
          )}
        </div>
      </div>
    </>
  );
}