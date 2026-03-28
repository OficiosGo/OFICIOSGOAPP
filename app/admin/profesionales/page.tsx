import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { db } from "@/db/client";
import { ApproveButton } from "./approve-button";
import { SuspendButton } from "./suspend-button";
import { AddSponsorForm, DeleteSponsorButton, TierSelect } from "./admin-forms";
import { AnalyticsPanel } from "./analytics-panel";

export const metadata = { title: "Admin - OficiosGo" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const [pending, approved, suspended, sponsors] = await Promise.all([
    professionalRepository.getByStatus("PENDING", 1, 100),
    professionalRepository.getByStatus("APPROVED", 1, 100),
    professionalRepository.getByStatus("SUSPENDED", 1, 100),
    db.sponsor.findMany({ orderBy: [{ tier: "asc" }, { createdAt: "desc" }] }),
  ]);

  const [totalUsers, totalClients, totalReviews, totalBudgets, totalEvents] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "CLIENT" } }),
    db.review.count({ where: { isVisible: true } }),
    db.budgetRequest.count(),
    db.profileEvent.count(),
  ]);

  const totalPros = pending.total + approved.total + suspended.total;

  const stats = [
    { label: "Profesionales", value: totalPros, icon: "👷" },
    { label: "Aprobados", value: approved.total, icon: "✅" },
    { label: "Pendientes", value: pending.total, icon: "⏳" },
    { label: "Suspendidos", value: suspended.total, icon: "🚫" },
    { label: "Clientes", value: totalClients, icon: "👥" },
    { label: "Usuarios", value: totalUsers, icon: "📊" },
    { label: "Opiniones", value: totalReviews, icon: "⭐" },
    { label: "Presupuestos", value: totalBudgets, icon: "📋" },
    { label: "Interacciones", value: totalEvents, icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="relative overflow-hidden px-5 pt-5 pb-6" style={{ background: "linear-gradient(175deg, #0F1120 0%, #1E2035 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 flex items-center justify-between mb-4">
          <Link href="/app">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="OficiosGo!" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/app" className="text-[11px] font-semibold text-gray-400 bg-white/10 px-3 py-1.5 rounded-lg">Ver app</Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="text-[11px] font-semibold text-red-400 bg-white/10 px-3 py-1.5 rounded-lg">Salir</button>
            </form>
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[9px] font-extrabold uppercase">Admin</span>
            <span className="text-[12px] text-gray-400">{user.name}</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Panel de Administración</h1>
        </div>
      </div>

      <div className="px-4 py-4 pb-10 space-y-5">

        <section>
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Estadísticas</h2>
          <div className="grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-center">
                <span className="text-lg">{s.icon}</span>
                <div className="text-lg font-black text-[#1A1D2E] mt-0.5">{s.value}</div>
                <div className="text-[9px] text-gray-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <AnalyticsPanel />

        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-[15px] font-extrabold text-[#1A1D2E]">Aprobación de profesionales</h2>
            {pending.total > 0 && <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-extrabold animate-pulse">{pending.total} nuevos</span>}
          </div>
          {pending.data.length === 0 ? (
            <div className="p-5 rounded-2xl bg-green-50 border border-green-100 text-center">
              <span className="text-2xl">✅</span>
              <p className="text-sm font-bold text-green-700 mt-2">Sin pendientes</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-yellow-200 divide-y divide-gray-100 overflow-hidden">
              {pending.data.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-sm font-black text-yellow-700 shrink-0">
                      {p.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-[#1A1D2E]">{p.user.name}</div>
                      <div className="text-[11px] text-gray-400">{p.category.name} · {p.city}</div>
                      <div className="text-[11px] text-gray-400 mt-1">📧 {p.user.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <ApproveButton profileId={p.id} />
                    <SuspendButton profileId={p.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-[15px] font-extrabold text-[#1A1D2E]">Profesionales activos</h2>
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-extrabold">{approved.total}</span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            {approved.data.map((p) => (
              <div key={p.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white text-sm font-black shrink-0">
                    {p.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-[#1A1D2E] truncate">{p.user.name}</div>
                    <div className="text-[11px] text-gray-400 truncate">{p.category.name} · {p.user.email}</div>
                  </div>
                  <TierSelect profileId={p.id} currentTier={(p as any).tier || "FREE"} />
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/app/profesional/${p.slug}`} className="flex-1 py-2 rounded-lg bg-gray-50 border border-gray-200 text-center text-[11px] font-bold text-[#1A1D2E]">Ver perfil</Link>
                  <SuspendButton profileId={p.id} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {suspended.data.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-[15px] font-extrabold text-[#1A1D2E]">Suspendidos</h2>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold">{suspended.total}</span>
            </div>
            <div className="bg-white rounded-2xl border border-red-100 divide-y divide-gray-100 overflow-hidden">
              {suspended.data.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 text-sm font-black shrink-0">
                      {p.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-[#1A1D2E] truncate">{p.user.name}</div>
                      <div className="text-[11px] text-gray-400 truncate">{p.category.name}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <ApproveButton profileId={p.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-[15px] font-extrabold text-[#1A1D2E]">Sponsors</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#F8C927]/20 text-[#E89015] text-[10px] font-extrabold">{sponsors.length}</span>
          </div>
          {sponsors.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden mb-3">
              {sponsors.map((s) => (
                <div key={s.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${s.tier === "PREMIUM" ? "bg-[#F8C927]/20" : "bg-blue-50"}`}>
                      {s.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.logoUrl} alt={s.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className={`text-sm font-black ${s.tier === "PREMIUM" ? "text-[#E89015]" : "text-blue-600"}`}>{s.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-[#1A1D2E] truncate">{s.name}</span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-[2px] rounded-md uppercase ${s.tier === "PREMIUM" ? "bg-[#F8C927] text-[#1A1D2E]" : "bg-blue-100 text-blue-600"}`}>{s.tier}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">{s.description}</div>
                    </div>
                    <DeleteSponsorButton sponsorId={s.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <AddSponsorForm />
        </section>

        <section>
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Herramientas</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <Link href="/app" className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm text-center active:scale-[0.97] transition-transform">
              <span className="text-lg">📱</span>
              <div className="text-[12px] font-bold text-[#1A1D2E] mt-1">Ver la app</div>
            </Link>
            <Link href="/registro" className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm text-center active:scale-[0.97] transition-transform">
              <span className="text-lg">➕</span>
              <div className="text-[12px] font-bold text-[#1A1D2E] mt-1">Nuevo profesional</div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}