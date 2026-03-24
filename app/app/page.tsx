import Link from "next/link";
import { categoryRepository } from "@/server/repositories/category.repository";
import { searchService } from "@/server/services/search.service";
import { sponsorRepository } from "@/server/repositories/sponsor.repository";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { HomeCTAs } from "@/components/features/home-ctas";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, featured, sponsors, total] = await Promise.all([
    categoryRepository.getAll(),
    searchService.getFeatured(8),
    sponsorRepository.getActive("Villa María"),
    professionalRepository.countAll(),
  ]);

  return (
    <>
      {/* ── Dark header ──────────────────────────── */}
      <div className="bg-gradient-to-b from-[#1A1D2E] to-[#252839] rounded-b-[28px] px-5 pt-4 pb-6 relative overflow-hidden">
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl font-black text-white italic">Oficios</span>
            <span className="text-2xl font-black text-[#F8C927] italic">Go!</span>
          </div>
          <Link href="/app/cuenta" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
          </Link>
        </div>

        {/* Search bar */}
        <Link href="/app/buscar" className="relative z-10 flex items-center gap-2.5 w-full px-4 py-3.5 bg-white rounded-[14px] shadow-lg shadow-black/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <span className="text-sm text-gray-400 font-medium">¿Qué necesitás hoy?</span>
        </Link>

        {/* CTA Buttons */}
        <HomeCTAs />

        {/* Category grid 2x2 */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mt-5">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/app/buscar?category=${cat.slug}`}
              className="relative overflow-hidden p-5 rounded-2xl text-center"
              style={{ background: "linear-gradient(145deg, #F8C927, #E5B800)" }}
            >
              <div className="absolute -top-2.5 -right-2.5 w-12 h-12 rounded-full bg-white/15" />
              <div className="text-3xl mb-1.5 drop-shadow-sm">{cat.icon}</div>
              <div className="text-sm font-extrabold text-[#1A1D2E]">{cat.name}</div>
            </Link>
          ))}
        </div>

        {/* More categories */}
        <Link href="/app/buscar" className="relative z-10 block w-full mt-3 py-2.5 text-center text-[13px] font-semibold text-white bg-white/[0.08] rounded-xl border border-white/10">
          Ver las {categories.length} categorías →
        </Link>
      </div>

      {/* ── Featured pros carousel ───────────────── */}
      <div className="mt-6 mb-2">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-lg font-black text-[#1A1D2E]">Profesionales Recomendados</h2>
          <Link href="/app/buscar" className="text-xs font-bold text-[#F8C927]">Ver todos</Link>
        </div>

        <div className="flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
          {featured.map((pro) => (
            <Link
              key={pro.id}
              href={`/app/profesional/${pro.slug}`}
              className="snap-start shrink-0 w-[145px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="relative h-[110px] overflow-hidden bg-gray-200">
                {pro.photos[0] ? (
                  <img src={pro.photos[0].url} alt={pro.user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white text-2xl font-black">
                    {pro.user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/60 rounded-md px-1.5 py-0.5">
                  <span className="text-[#F8C927] text-[10px]">★</span>
                  <span className="text-[11px] font-bold text-white">{pro.averageRating.toFixed(1)}</span>
                </div>
                <div className="absolute bottom-1.5 right-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                </div>
              </div>
              <div className="p-2.5">
                <div className="text-[13px] font-extrabold text-[#1A1D2E] leading-tight truncate">{pro.user.name}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">· {pro.category.name}</div>
                <div className="mt-2 py-1.5 rounded-lg bg-[#F8C927] text-center text-[11px] font-extrabold text-[#1A1D2E]">
                  Contactar
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── All professionals list ───────────────── */}
      <div className="px-5 pb-24">
        <h2 className="text-lg font-black text-[#1A1D2E] mb-3">Todos los Profesionales</h2>
        <div className="flex flex-col gap-2.5">
          {featured.map((pro) => (
            <Link
              key={pro.id}
              href={`/app/profesional/${pro.slug}`}
              className={`flex items-center gap-3 p-3 rounded-2xl bg-white border shadow-sm ${
                pro.tier === "PREMIUM" ? "border-[#F8C927]/30" : "border-gray-200"
              }`}
            >
              {pro.photos[0] ? (
                <img src={pro.photos[0].url} alt={pro.user.name} className="w-14 h-14 rounded-[14px] object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white font-black shrink-0">
                  {pro.user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-[#1A1D2E] truncate">{pro.user.name}</span>
                  {pro.tier === "PREMIUM" && (
                    <span className="text-[8px] font-extrabold bg-gradient-to-r from-[#F5A623] to-[#F8C927] text-[#1A1D2E] px-1.5 py-px rounded uppercase shrink-0">Premium</span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">{pro.category.name} · {pro.city}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[#F8C927] text-xs">★</span>
                  <span className="text-xs font-bold">{pro.averageRating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400">({pro.totalReviews})</span>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Sponsors ─────────────────────────────── */}
      {sponsors.length > 0 && (
        <div className="px-5 pb-24">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center mb-3">Proveedores asociados</h3>
          <div className="flex flex-col gap-2">
            {sponsors.map((s) => (
              <div key={s.id} className={`p-4 rounded-2xl border ${s.tier === "PREMIUM" ? "border-[#F8C927]/30 bg-yellow-50/50" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#1A1D2E]">{s.name}</span>
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${s.tier === "PREMIUM" ? "bg-[#F5A623]/20 text-[#F5A623]" : "bg-[#5C80BC]/10 text-[#5C80BC]"}`}>{s.tier}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{s.description}</p>
                {s.phone && <p className="text-xs text-[#5C80BC] font-semibold mt-1.5">📞 {s.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

    </>
  );
}