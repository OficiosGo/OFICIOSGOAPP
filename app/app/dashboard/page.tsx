import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { budgetRepository } from "@/server/repositories/budget.repository";
import { db } from "@/db/client";
import { UpgradePlan } from "@/components/features/upgrade-plan";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await professionalRepository.getByUserId(user.id);
  if (!profile) redirect("/login");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentEvents = await db.profileEvent.groupBy({
    by: ["eventType"],
    where: { profileId: profile.id, createdAt: { gte: thirtyDaysAgo } },
    _count: true,
  });

  const recentViews = recentEvents.find((e) => e.eventType === "view")?._count ?? 0;
  const recentContacts = recentEvents.find((e) => e.eventType === "contact")?._count ?? 0;
  const conversionRate = recentViews > 0 ? ((recentContacts / recentViews) * 100).toFixed(1) : "0";

  const recentReviews = await db.review.findMany({
    where: { profileId: profile.id, isVisible: true, deletedAt: null },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const budgetRequests = await budgetRepository.getForProfessional(profile.categoryId, 1, 5);

  const metrics = [
    { label: "Vistas", value: profile.totalViews, recent: recentViews, icon: "👁", bg: "bg-blue-50" },
    { label: "Contactos", value: profile.totalContacts, recent: recentContacts, icon: "📞", bg: "bg-green-50" },
    { label: "Rating", value: profile.averageRating.toFixed(1), recent: null, icon: "⭐", bg: "bg-yellow-50" },
    { label: "Opiniones", value: profile.totalReviews, recent: null, icon: "💬", bg: "bg-emerald-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <div className="px-5 pt-5 pb-6" style={{ background: "linear-gradient(175deg, #0F1120 0%, #1E2035 100%)" }}>
        <div className="flex items-center justify-between mb-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="OficiosGo!" className="h-7 w-auto" />
          {(profile.tier === "PREMIUM" || profile.tier === "STANDARD") && (
            <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${profile.tier === "PREMIUM" ? "bg-[#F8C927] text-[#1A1D2E]" : "bg-[#5C80BC] text-white"}`}>
              {profile.tier === "PREMIUM" ? "★ Premium" : "Standard"}
            </span>
          )}
        </div>
        <h1 className="text-xl font-black text-white mt-3">Hola, {user.name.split(" ")[0]} 👋</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Así va tu perfil este mes</p>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {metrics.map((m) => (
            <div key={m.label} className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-center">
              <span className="text-base">{m.icon}</span>
              <div className="text-[17px] font-black text-white mt-0.5">{m.value}</div>
              <div className="text-[9px] text-gray-400 font-medium">{m.label}</div>
              {m.recent !== null && <div className="text-[9px] text-[#F8C927] font-bold mt-0.5">+{m.recent} mes</div>}
            </div>
          ))}
        </div>

        {/* Conversion rate */}
        <div className="mt-3 p-3 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-gray-400">Tasa de conversión</div>
            <div className="text-[13px] font-bold text-white">{conversionRate}% de las visitas te contactan</div>
          </div>
          <div className="text-xl font-black text-[#F8C927]">{conversionRate}%</div>
        </div>
      </div>

      <div className="px-4 py-4 pb-28 space-y-4">

        {/* Status banner */}
        {profile.status === "PENDING" && (
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">⏳</span>
              <span className="text-[13px] font-bold text-yellow-800">Perfil pendiente de aprobación</span>
            </div>
            <p className="text-[12px] text-yellow-700">Un administrador lo va a revisar pronto. Mientras tanto, completá tu información y subí fotos.</p>
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
                <span className="px-2 py-0.5 rounded-full bg-[#F8C927] text-[#1A1D2E] text-[10px] font-extrabold">{budgetRequests.total}</span>
              </h3>
            </div>
            <div className="space-y-2.5">
              {budgetRequests.data.map((req) => (
                <div key={req.id} className="p-3 rounded-xl bg-[#FFFCF0] border border-yellow-100">
                  <p className="text-[13px] font-bold text-[#1A1D2E] line-clamp-2">{req.description}</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {new Date(req.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <a href={`https://wa.me/54${req.clientPhone ?? ""}?text=${encodeURIComponent(`Hola ${req.clientName ?? ""}, soy ${user.name} de OficiosGo! Vi tu pedido y me gustaría ayudarte.`)}`} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#25D366] text-white text-[12px] font-bold active:scale-[0.98] transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Contactar por WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent reviews */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100">
          <h3 className="text-[14px] font-extrabold text-[#1A1D2E] mb-3">Últimas opiniones</h3>
          {recentReviews.length === 0 ? (
            <p className="text-[13px] text-gray-400 py-3">Todavía no recibiste opiniones</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentReviews.map((rev) => (
                <div key={rev.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#1A1D2E]">{rev.author.name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`text-[11px] ${s <= rev.rating ? "text-[#F8C927]" : "text-gray-200"}`}>★</span>
                      ))}
                    </div>
                  </div>
                  {rev.comment && <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">{rev.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Editar perfil", icon: "✏️", href: "/app/cuenta/editar" },
            { label: "Mis fotos", icon: "📸", href: "/app/cuenta/fotos" },
            { label: "Mis opiniones", icon: "💬", href: "/app/cuenta/opiniones" },
            { label: "Ver mi perfil", icon: "👁️", href: `/app/profesional/${profile.slug}` },
          ].map((a) => (
            <Link key={a.label} href={a.href} className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-white border border-gray-100 text-[13px] font-bold text-[#1A1D2E] active:scale-[0.97] transition-transform">
              <span className="text-base">{a.icon}</span>
              {a.label}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}