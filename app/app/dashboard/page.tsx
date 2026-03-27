import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { budgetRepository } from "@/server/repositories/budget.repository";
import { ProfilePhotoUpload } from "@/components/features/profile-photo-upload";
import { db } from "@/db/client";

export const metadata = {
  title: "Panel de control - OficiosGo",
  description: "Gestiona tu perfil profesional en OficiosGo",
};

function TrendBadge({ value }: { value: number }) {
  if (value === 0) return <span className="text-[10px] text-gray-400">Empeza a compartir tu perfil</span>;
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0"><path d="M5 2L9 8H1L5 2Z" fill="currentColor" /></svg>
      +{value} este mes
    </span>
  );
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill={i < rating ? "#F8C927" : "#E5E7EB"}>
          <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8.02l-2.78 1.54.53-3.1L1.5 4.27l3.11-.45L6 1z" />
        </svg>
      ))}
    </div>
  );
}

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

  const recentReviews = await db.review.findMany({
    where: { profileId: profile.id, isVisible: true, deletedAt: null },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const budgetRequests = await budgetRepository.getForProfessional(profile.categoryId, 1, 5);

  const isPremium = profile.tier === "PREMIUM";
  const firstName = user.name.split(" ")[0];

  const metrics = [
    { label: "Visitas", value: profile.totalViews, recent: recentViews, icon: "👁️", bg: "bg-blue-50" },
    { label: "Contactos", value: profile.totalContacts, recent: recentContacts, icon: "📞", bg: "bg-emerald-50" },
    { label: "Rating", value: profile.averageRating.toFixed(1), recent: null, icon: "⭐", bg: "bg-yellow-50" },
    { label: "Opiniones", value: profile.totalReviews, recent: null, icon: "💬", bg: "bg-violet-50" },
  ];

  return (
    <>
      {/* ── Header PWA style ── */}
      <div className="relative overflow-hidden rounded-b-[28px] px-5 pt-4 pb-6" style={{ background: "linear-gradient(175deg, #0F1120 0%, #1E2035 100%)" }}>
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(248,201,39,0.12), transparent 70%)", filter: "blur(40px)" }} />

        <div className="relative z-10 flex items-center justify-between mb-5">
          <Link href="/app">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="OficiosGo!" className="h-9 w-auto" />
          </Link>
          <Link href="/app/cuenta" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </Link>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <ProfilePhotoUpload currentImage={(profile as any).profileImage} userName={user.name} />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-white leading-tight">{firstName} 👋</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {recentViews > 0 ? `${recentViews} personas vieron tu perfil este mes` : "Completa tu perfil para aparecer en busquedas"}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              {profile.status === "PENDING" && (
                <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-[9px] font-bold">En revision</span>
              )}
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${isPremium ? "bg-[#F8C927] text-[#1A1D2E]" : profile.tier === "STANDARD" ? "bg-blue-500 text-white" : "bg-white/15 text-white/60"}`}>
                {isPremium ? "★ Premium" : profile.tier === "STANDARD" ? "Standard" : "Free"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 pb-28 space-y-4">

        {/* ── Pending banner ── */}
        {profile.status === "PENDING" && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-900">
            <span className="text-lg shrink-0">📋</span>
            <div><strong className="font-bold">Tu perfil esta en revision.</strong> Completa tu descripcion y subi fotos de tus trabajos.</div>
          </div>
        )}

        {/* ── Budget Requests ── */}
        {budgetRequests.data.length > 0 && (
          <div className="p-4 rounded-2xl bg-white border-2 border-[#F8C927]/40 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-extrabold text-[#1A1D2E] flex items-center gap-2">
                📋 Clientes te buscan
                <span className="px-2 py-0.5 rounded-full bg-[#F8C927] text-[#1A1D2E] text-[10px] font-extrabold">{budgetRequests.total}</span>
              </h2>
            </div>
            <div className="space-y-2.5">
              {budgetRequests.data.map((req) => (
                <div key={req.id} className="p-3.5 rounded-xl bg-[#FFFBEA] border border-yellow-100">
                  <p className="text-[13px] font-semibold text-[#1A1D2E] line-clamp-2">{req.description}</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {new Date(req.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <a href={`https://wa.me/54${req.clientPhone ?? ""}?text=${encodeURIComponent(`Hola ${req.clientName ?? ""}, soy ${user.name} de OficiosGo. Vi tu pedido y me gustaria ayudarte.`)}`} target="_blank" rel="noopener noreferrer" className="mt-2.5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white text-[13px] font-bold active:scale-[0.98] transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Responder por WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Metrics ── */}
        <div className="grid grid-cols-2 gap-2.5">
          {metrics.map((m) => (
            <div key={m.label} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center text-base mb-2`}>{m.icon}</div>
              <div className="text-2xl font-black text-[#1A1D2E] leading-none">{m.value}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{m.label}</div>
              {m.recent !== null && <div className="mt-1"><TrendBadge value={m.recent} /></div>}
            </div>
          ))}
        </div>

        {/* ── Plan card ── */}
        <div className="p-5 rounded-2xl text-white" style={{ background: "linear-gradient(135deg, #0F1120, #1E2035)" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-extrabold">Plan {profile.tier === "FREE" ? "Gratuito" : profile.tier === "PREMIUM" ? "Premium" : "Standard"}</h2>
              <p className="text-[12px] text-gray-400 mt-0.5">{profile.tier === "FREE" ? "Aparece primero con Premium" : "Perfil destacado en busquedas"}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${profile.tier === "FREE" ? "bg-white/10 text-gray-400" : "bg-[#F8C927] text-[#1A1D2E]"}`}>
              {profile.tier === "FREE" ? "Inactivo" : "Activo"}
            </span>
          </div>
          {profile.tier === "FREE" && (
            <button className="w-full py-3 rounded-xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-sm active:scale-[0.98] transition-transform">
              Probar Premium $4.990/mes
            </button>
          )}
        </div>

        {/* ── Reviews ── */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <h2 className="text-[14px] font-extrabold text-[#1A1D2E] mb-3">Ultimas opiniones</h2>
          {recentReviews.length === 0 ? (
            <div className="text-center py-6">
              <span className="text-3xl">💬</span>
              <p className="text-sm font-semibold text-gray-700 mt-2">Sin opiniones todavia</p>
              <p className="text-xs text-gray-400 mt-1">Pedile a tus clientes que te dejen una</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentReviews.map((rev) => (
                <div key={rev.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-bold text-[#1A1D2E] truncate">{rev.author.name}</span>
                    <StarRating rating={rev.rating} />
                  </div>
                  {rev.comment && <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">{rev.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Quick actions ── */}
        <div>
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Acciones rapidas</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Editar perfil", emoji: "✏️", href: "/app/cuenta/editar", desc: "Datos y descripcion" },
              { label: "Mis fotos", emoji: "📸", href: "/app/cuenta/fotos", desc: "Mostra tu trabajo" },
              { label: "Mis opiniones", emoji: "💬", href: "/app/cuenta/opiniones", desc: "Responde clientes" },
              { label: "Mi perfil", emoji: "👁️", href: `/app/profesional/${profile.slug}`, desc: "Lo que ven los clientes" },
            ].map((a) => (
              <Link key={a.label} href={a.href} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-gray-100 shadow-sm active:scale-[0.97] transition-transform">
                <span className="text-lg shrink-0">{a.emoji}</span>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[#1A1D2E] truncate">{a.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{a.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}