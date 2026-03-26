import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { db } from "@/db/client";

export default async function EstadisticasPage() {
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

  const recentViews = recentEvents.find(e => e.eventType === "view")?._count ?? 0;
  const recentContacts = recentEvents.find(e => e.eventType === "contact")?._count ?? 0;

  const metrics = [
    { label: "Visitas totales", value: profile.totalViews, recent: recentViews, icon: "👁️", bg: "bg-blue-50" },
    { label: "Contactos totales", value: profile.totalContacts, recent: recentContacts, icon: "📞", bg: "bg-green-50" },
    { label: "Rating promedio", value: profile.averageRating.toFixed(1), recent: null, icon: "⭐", bg: "bg-yellow-50" },
    { label: "Resenas totales", value: profile.totalReviews, recent: null, icon: "💬", bg: "bg-purple-50" },
  ];

  const conversionRate = profile.totalViews > 0 ? ((profile.totalContacts / profile.totalViews) * 100).toFixed(1) : "0";

  return (
    <>
      <div className="bg-[#1A1D2E] px-5 pt-4 pb-5 rounded-b-[20px]">
        <div className="flex items-center gap-3">
          <Link href="/app/cuenta" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h1 className="text-lg font-black text-[#F8C927]">Estadisticas</h1>
        </div>
      </div>

      <div className="px-4 py-5 pb-24">
        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {metrics.map(m => (
            <div key={m.label} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${m.bg} flex items-center justify-center text-lg mb-3`}>{m.icon}</div>
              <div className="text-2xl font-black text-[#1A1D2E]">{m.value}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{m.label}</div>
              {m.recent !== null && m.recent > 0 && (
                <div className="text-[11px] text-green-600 font-semibold mt-1">+{m.recent} este mes</div>
              )}
            </div>
          ))}
        </div>

        {/* Conversion rate */}
        <div className="p-5 rounded-2xl bg-[#1A1D2E] text-white mb-4">
          <div className="text-xs text-gray-400 mb-1">Tasa de conversion</div>
          <div className="text-3xl font-black text-[#F8C927]">{conversionRate}%</div>
          <div className="text-xs text-gray-400 mt-1">De cada 100 personas que ven tu perfil, {conversionRate} te contactan</div>
          <div className="w-full h-2 rounded-full bg-white/10 mt-3">
            <div className="h-full rounded-full bg-[#F8C927]" style={{ width: `${Math.min(Number(conversionRate), 100)}%` }} />
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100">
          <div className="text-sm font-bold text-[#1A1D2E] mb-2">💡 Para mejorar tus metricas:</div>
          <div className="space-y-1.5 text-xs text-gray-600">
            <p>• Completa tu biografia con detalle de tus servicios</p>
            <p>• Subi fotos de tus mejores trabajos</p>
            <p>• Pedile a tus clientes que te dejen una resena</p>
            <p>• Activa el plan Premium para aparecer primero</p>
          </div>
        </div>
      </div>
    </>
  );
}