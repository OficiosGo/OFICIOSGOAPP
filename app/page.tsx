import Link from "next/link";
import { categoryRepository } from "@/server/repositories/category.repository";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { sponsorRepository } from "@/server/repositories/sponsor.repository";
import { searchService } from "@/server/services/search.service";
import { Footer } from "@/components/ui/footer";
import { LandingNavbar } from "@/components/ui/landing-navbar";

export const revalidate = 60;

export default async function LandingPage() {
  const [categories, featured, sponsors, totalPros] = await Promise.all([
    categoryRepository.getAll(),
    searchService.getFeatured(4),
    sponsorRepository.getActive("Villa María"),
    professionalRepository.countAll(),
  ]);

  const avgRating = featured.length > 0
    ? (featured.reduce((sum, p) => sum + p.averageRating, 0) / featured.length).toFixed(1)
    : "4.7";

  return (
    <div className="bg-white">
      {/* ═══ NAVBAR ═══ */}
      <LandingNavbar />

      {/* ═══ HERO WITH FLOATING PHONE ═══ */}
      <section className="relative min-h-screen overflow-hidden flex items-center" style={{ background: "linear-gradient(155deg, #1A1D2E 0%, #0D0F1A 50%, #252839 100%)" }}>
        {/* Background effects */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-[15%] right-[-8%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(248,201,39,0.08), transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(92,128,188,0.06), transparent 70%)", filter: "blur(50px)" }} />

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 w-full flex items-center justify-between gap-16 flex-wrap relative z-10">
          {/* Left: Copy */}
          <div className="flex-1 min-w-[320px] max-w-[560px]">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.07] border border-white/10 text-xs font-semibold text-gray-400 mb-6">
              📍 Villa María, Córdoba · Ahora disponible
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white leading-[1.08] tracking-tight">
              Tu profesional
              <br />de confianza,
              <br />
              <span className="bg-gradient-to-r from-[#F8C927] to-[#F5A623] bg-clip-text text-transparent">
                en tu bolsillo
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mt-5 max-w-md">
              Electricistas, plomeros, pintores, carpinteros y más.
              Descargá la app, elegí un profesional verificado y contactalo directo.
            </p>

            {/* CTAs */}
            <div className="flex gap-4 mt-9 flex-wrap">
              <Link
                href="/app"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#F8C927] text-[#1A1D2E] text-lg font-extrabold shadow-xl shadow-[#F8C927]/25 hover:scale-[1.04] transition-transform"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                Ver App
              </Link>
              <Link
                href="/app"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.07] border-2 border-white/15 text-white text-lg font-bold backdrop-blur-md hover:bg-white/[0.12] hover:border-[#F8C927]/50 transition-all"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Descargar App
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-10 flex-wrap">
              {[
                { v: `${totalPros}+`, l: "Profesionales" },
                { v: avgRating, l: "Rating promedio" },
                { v: `${categories.length}`, l: "Categorías" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl sm:text-3xl font-black text-white">{s.v}</div>
                  <div className="text-xs text-gray-400 font-medium mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div className="flex-shrink-0 hidden md:flex justify-center animate-float">
            <div className="w-[230px] h-[460px] rounded-[36px] bg-[#111] p-2 border-[3px] border-[#333] relative shadow-2xl shadow-black/40">
              {/* Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#111] rounded-b-2xl z-10" />
              {/* Screen */}
              <div className="w-full h-full rounded-[28px] bg-[#F5F5F7] overflow-hidden relative">
                {/* Mini PWA inside phone */}
                <div style={{ background: "linear-gradient(180deg, #1A1D2E, #252839)" }} className="rounded-b-[14px] p-3 pb-4">
                  <div className="flex justify-between items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo-white.svg" alt="OficiosGo!" className="h-4 w-auto" />
                    <div className="w-5 h-5 rounded-full bg-white/10" />
                  </div>
                  <div className="mt-2 px-2 py-2 bg-white rounded-lg flex items-center gap-1.5">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                    <span className="text-[7px] text-gray-400">¿Qué necesitás hoy?</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                    {[{i:"🔧",n:"Plomería"},{i:"💡",n:"Electricidad"},{i:"🧹",n:"Limpieza"},{i:"🎨",n:"Pintura"}].map((c)=>(
                      <div key={c.n} className="py-2.5 rounded-lg text-center" style={{ background: "linear-gradient(145deg, #F8C927, #E5B800)" }}>
                        <div className="text-base">{c.i}</div>
                        <div className="text-[6px] font-extrabold text-[#1A1D2E] mt-0.5">{c.n}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-[8px] font-extrabold text-[#1A1D2E] mb-1.5">Profesionales Recomendados</div>
                  <div className="flex gap-1.5">
                    {featured.slice(0, 3).map((pro) => (
                      <div key={pro.id} className="w-[60px] shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <div className="h-10 bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white text-[10px] font-black">
                          {pro.user.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div className="p-1">
                          <div className="text-[5px] font-extrabold text-[#1A1D2E] leading-tight truncate">{pro.user.name}</div>
                          <div className="text-[4px] text-gray-500">{pro.category.name}</div>
                          <div className="mt-1 py-0.5 rounded bg-[#F8C927] text-center text-[5px] font-extrabold text-[#1A1D2E]">Contactar</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Mini tab bar */}
                <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-200 flex py-1">
                  {["🏠","🔍","📋","👤"].map((ic,i)=>(
                    <div key={i} className="flex-1 text-center" style={{ fontSize:9, opacity:i===0?1:.35 }}>
                      {ic}
                      <div style={{ fontSize:3.5 }} className={i===0?"font-bold text-[#1A1D2E]":"text-gray-400"}>
                        {["Inicio","Servicios","Pedidos","Cuenta"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-pulse">
          <span className="text-[10px] text-gray-500">Conocé más</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#121317] tracking-tight">¿Qué necesitás resolver?</h2>
          <p className="text-gray-500 mt-2 text-base">Profesionales verificados en {categories.length} categorías</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/app/buscar?category=${cat.slug}`} className="group p-6 rounded-2xl border border-gray-200 bg-white text-center hover:-translate-y-1 hover:shadow-lg hover:border-[#F8C927] transition-all duration-200">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-bold text-[#121317]">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-1">{cat._count.profiles} profesionales</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ FEATURED PROFESSIONALS ═══ */}
      {featured.length > 0 && (
        <section className="py-20 px-6 bg-[#F8F8FA]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
              <div>
                <h2 className="text-3xl font-black text-[#121317]">Profesionales destacados</h2>
                <p className="text-gray-500 mt-1">Los mejor valorados por la comunidad</p>
              </div>
              <Link href="/app/buscar" className="px-5 py-2.5 rounded-lg bg-[#121317] text-[#F8C927] text-sm font-bold hover:bg-gray-800 transition-colors">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((pro) => {
                const isPremium = pro.tier === "PREMIUM";
                return (
                  <Link key={pro.id} href={`/app/profesional/${pro.slug}`} className={`block rounded-2xl overflow-hidden bg-white transition-all hover:-translate-y-1 hover:shadow-xl ${isPremium ? "border-2 border-[#F5A623]" : "border border-gray-200"}`}>
                    <div className="flex gap-3 p-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white text-lg font-black shrink-0">
                        {pro.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#121317] text-[15px] truncate">{pro.user.name}</span>
                          {isPremium && <span className="shrink-0 text-[9px] font-extrabold bg-gradient-to-r from-[#F5A623] to-[#F8C927] text-[#121317] px-2 py-0.5 rounded-md uppercase">Premium</span>}
                        </div>
                        <div className="text-xs text-[#5C80BC] font-semibold mt-0.5">{pro.category.icon} {pro.category.name}</div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[#F8C927]">★</span>
                          <span className="text-sm font-bold">{pro.averageRating.toFixed(1)}</span>
                          <span className="text-xs text-gray-400">({pro.totalReviews})</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ SPONSORS ═══ */}
      {sponsors.length > 0 && (
        <section className="py-14 px-6 max-w-7xl mx-auto">
          <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-400 text-center mb-6">Proveedores asociados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sponsors.map((s) => (
              <div key={s.id} className={`p-5 rounded-2xl border ${s.tier === "PREMIUM" ? "border-[#F5A623]/30 bg-gradient-to-br from-yellow-50/50 to-white" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#121317]">{s.name}</span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase ${s.tier === "PREMIUM" ? "bg-[#F5A623]/15 text-[#F5A623]" : "bg-[#5C80BC]/10 text-[#5C80BC]"}`}>{s.tier}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{s.description}</p>
                {s.phone && <p className="text-sm text-[#5C80BC] font-semibold mt-2">📞 {s.phone}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className="py-20 px-6 text-center relative overflow-hidden" style={{ background: "#1A1D2E" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(248,201,39,0.05), transparent 70%)" }} />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">¿Sos profesional de oficios?</h2>
          <p className="text-base text-gray-500 max-w-md mx-auto mb-9 leading-relaxed">
            Registrate gratis, mostrá tus trabajos y recibí clientes. Planes Premium desde $2.990/mes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/app" className="px-10 py-4 rounded-xl bg-[#F8C927] text-[#121317] font-extrabold text-lg shadow-xl shadow-[#F8C927]/20 hover:scale-[1.03] transition-transform">
              Descargar la App
            </Link>
            <Link href="/registro" className="px-10 py-4 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-lg hover:bg-white/15 transition-colors">
              Crear mi perfil
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-16px) rotate(0deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}