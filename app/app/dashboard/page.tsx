import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
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
