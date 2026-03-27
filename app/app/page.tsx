import Link from "next/link";
import { categoryRepository } from "@/server/repositories/category.repository";
import { searchService } from "@/server/services/search.service";
import { sponsorRepository } from "@/server/repositories/sponsor.repository";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { HomeCTAs } from "@/components/features/home-ctas";

export const revalidate = 60;

const INITIALS = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const AVATAR_GRADIENTS = [
  ["#5C80BC", "#3a5a96"],
  ["#F5A623", "#c97d10"],
  ["#7A9263", "#506048"],
  ["#BC5C80", "#963a5a"],
  ["#5CBCBC", "#3a9696"],
  ["#9C5CBC", "#7a3a96"],
  ["#BC9C5C", "#967a3a"],
  ["#5C9C5C", "#3a7a3a"],
];

function getProImage(pro: any): string | null {
  return pro.profileImage || pro.photos?.[0]?.url || null;
}

export default async function HomePage() {
  const [categories, featured, sponsors, total] = await Promise.all([
    categoryRepository.getAll(),
    searchService.getFeatured(8),
    sponsorRepository.getActive("Villa María"),
    professionalRepository.countAll(),
  ]);

  const topCategories = categories.slice(0, 4);

  return (
    <>
      {/* ── HEADER ── */}
      <div className="relative overflow-hidden rounded-b-[32px] px-5 pt-4 pb-6" style={{ background: "linear-gradient(175deg, #0F1120 0%, #1E2035 100%)" }}>
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(248,201,39,0.12), transparent 70%)", filter: "blur(40px)" }} />

        <div className="relative z-10 flex items-center justify-between mb-4">
          <Link href="/app">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="OficiosGo!" className="h-10 w-auto" />
          </Link>
          <Link href="/app/cuenta" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
          </Link>
        </div>

        <p className="relative z-10 text-[13px] text-gray-400 mb-2 font-medium">Que problema resolvemos hoy?</p>

        <Link href="/app/buscar" className="relative z-10 flex items-center gap-3 w-full px-4 py-3.5 bg-white rounded-2xl shadow-lg shadow-black/20 active:scale-[0.98] transition-transform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <span className="text-sm text-gray-400 font-medium flex-1">Plomero, electricista, pintor...</span>
          <span className="text-[11px] text-gray-300 bg-gray-100 px-2 py-0.5 rounded-md font-semibold shrink-0">Buscar</span>
        </Link>

        <HomeCTAs />

        <div className="relative z-10 grid grid-cols-2 gap-2.5 mt-4">
          {topCategories.map((cat) => (
            <Link key={cat.id} href={`/app/buscar?category=${cat.slug}`} className="group relative overflow-hidden flex items-center gap-3 p-3.5 rounded-2xl active:scale-[0.97] transition-transform" style={{ background: "linear-gradient(145deg, #F8C927, #E8B800)" }}>
              <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-white/15" />
              <span className="text-2xl drop-shadow-sm shrink-0 relative z-10">{cat.icon}</span>
              <div className="relative z-10 min-w-0">
                <div className="text-[13px] font-extrabold text-[#0F1120] leading-tight truncate">{cat.name}</div>
                <div className="text-[10px] text-[#0F1120]/60 font-medium mt-0.5">{cat._count.profiles} {cat._count.profiles === 1 ? "profesional" : "disponibles"}</div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/app/buscar" className="relative z-10 flex items-center justify-center gap-1.5 w-full mt-3 py-2.5 text-[13px] font-semibold text-white/70 bg-white/[0.07] rounded-xl border border-white/10 hover:bg-white/[0.12] transition-colors active:scale-[0.98]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Ver las {categories.length} categorias
        </Link>
      </div>

      {/* ── FEATURED ── */}
      <section className="mt-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <div>
            <h2 className="text-[17px] font-black text-[#0F1120] leading-tight">Mejor valorados</h2>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Calificados por vecinos de Villa Maria</p>
          </div>
          <Link href="/app/buscar" className="text-[12px] font-bold text-[#0F1120] bg-[#F8C927] px-3 py-1.5 rounded-lg active:scale-[0.97] transition-transform">Ver todos</Link>
        </div>

        {featured.length === 0 ? (
          <div className="mx-5 py-10 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-gray-400 text-sm font-medium">Pronto habra profesionales destacados aqui</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto px-5 pb-3 snap-x snap-mandatory" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {featured.map((pro, i) => {
              const img = getProImage(pro);
              const [from, to] = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
              return (
                <Link key={pro.id} href={`/app/profesional/${pro.slug}`} className="snap-start shrink-0 w-[152px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.97] transition-transform">
                  <div className="relative h-[112px] overflow-hidden">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={`${pro.user.name}, ${pro.category.name}`} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-black" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
                        {INITIALS(pro.user.name)}
                      </div>
                    )}
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/65 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                      <span className="text-[#F8C927] text-[10px]">★</span>
                      <span className="text-[11px] font-bold text-white">{pro.averageRating.toFixed(1)}</span>
                    </div>
                    {pro.tier === "PREMIUM" && (
                      <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-[#F5A623] to-[#F8C927] text-[#0F1120] text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wide">Premium</div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <div className="text-[13px] font-extrabold text-[#0F1120] leading-tight truncate">{pro.user.name}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 truncate">{pro.category.icon} {pro.category.name}</div>
                    <div className="mt-2 py-1.5 rounded-xl bg-[#0F1120] text-center text-[11px] font-extrabold text-[#F8C927]">Ver perfil</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── ALL PROFESSIONALS ── */}
      <section className="mt-5 px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[17px] font-black text-[#0F1120]">Todos los profesionales</h2>
          <span className="text-[11px] text-gray-400 font-medium bg-gray-100 px-2.5 py-1 rounded-full">{total}+ activos</span>
        </div>

        <div className="flex flex-col gap-2">
          {featured.map((pro, i) => {
            const img = getProImage(pro);
            const [from, to] = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
            return (
              <Link key={pro.id} href={`/app/profesional/${pro.slug}`} className={`flex items-center gap-3 p-3 rounded-2xl bg-white border shadow-sm active:scale-[0.98] transition-transform ${pro.tier === "PREMIUM" ? "border-[#F8C927]/40 shadow-[#F8C927]/5" : "border-gray-100"}`}>
                <div className="shrink-0">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={`${pro.user.name}`} className="w-[52px] h-[52px] rounded-[14px] object-cover" loading="lazy" />
                  ) : (
                    <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-white text-base font-black" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
                      {INITIALS(pro.user.name)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[14px] font-extrabold text-[#0F1120] truncate">{pro.user.name}</span>
                    {pro.tier === "PREMIUM" && (
                      <span className="text-[8px] font-extrabold bg-gradient-to-r from-[#F5A623] to-[#F8C927] text-[#0F1120] px-1.5 py-[2px] rounded-md uppercase tracking-wide shrink-0">Premium</span>
                    )}
                  </div>
                  <div className="text-[12px] text-gray-500 mt-0.5 truncate">{pro.category.name}{pro.city ? ` · ${pro.city}` : ""}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[#F8C927] text-[11px]">★</span>
                    <span className="text-[12px] font-bold text-[#0F1120]">{pro.averageRating.toFixed(1)}</span>
                    <span className="text-[11px] text-gray-400">({pro.totalReviews})</span>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            );
          })}
        </div>

        <Link href="/app/buscar" className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-[13px] font-bold text-gray-400 hover:border-[#F8C927] hover:text-[#0F1120] transition-colors active:scale-[0.98]">
          Ver los {total}+ profesionales
        </Link>
      </section>

      {/* ── SPONSORS + PUBLICITAR ── */}
      <section className="px-5 pt-6 pb-28">
        {sponsors.length > 0 && (
          <>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 text-center mb-3">Negocios que confian en OficiosGo!</h2>
            <div className="flex flex-col gap-3 mb-5">
              {sponsors.map((s) => {
                const isPrem = s.tier === "PREMIUM";
                return (
                  <div key={s.id} className={`relative overflow-hidden rounded-2xl ${isPrem ? "border-2 border-[#F8C927]/40 bg-white shadow-md" : "border border-gray-100 bg-white shadow-sm"}`}>
                    {isPrem && <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #F5A623, #F8C927, #F5A623)" }} />}
                    <div className="p-4">
                      <div className="flex items-center gap-3.5 mb-3">
                        <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${isPrem ? "bg-[#F8C927]/10 border-2 border-[#F8C927]/30" : "bg-gray-50 border border-gray-200"}`}>
                          {(s as any).logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={(s as any).logoUrl} alt={s.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className={`text-xl font-black ${isPrem ? "text-[#F8C927]" : "text-gray-300"}`}>{s.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-extrabold text-[#0F1120] truncate">{s.name}</div>
                          <span className={`inline-block mt-1 text-[8px] font-extrabold px-1.5 py-[2px] rounded-md uppercase tracking-wide ${isPrem ? "bg-[#F8C927] text-[#0F1120]" : "bg-[#5C80BC]/10 text-[#5C80BC]"}`}>
                            {isPrem ? "★ Premium Partner" : "Sponsor"}
                          </span>
                        </div>
                      </div>
                      <p className="text-[12px] text-gray-500 leading-relaxed mb-3">{s.description}</p>
                      <div className="flex gap-2">
                        {(s as any).whatsapp && (
                          <a href={`https://wa.me/${(s as any).whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] text-white text-[12px] font-bold active:scale-[0.97] transition-transform">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            WhatsApp
                          </a>
                        )}
                        {s.phone && (
                          <a href={`tel:${s.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0F1120] text-white text-[12px] font-bold active:scale-[0.97] transition-transform">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                            Llamar
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <a href="https://wa.me/5493535698990?text=Hola%2C%20quiero%20publicitar%20mi%20negocio%20en%20OficiosGo!" target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden">
          <div className="relative p-5 pb-4" style={{ background: "linear-gradient(135deg, #0F1120 0%, #1A1D2E 50%, #252839 100%)" }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(248,201,39,0.15), transparent 70%)", filter: "blur(20px)" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#F8C927] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0F1120"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <span className="text-[10px] font-bold text-[#F8C927] uppercase tracking-widest">Espacio publicitario</span>
              </div>
              <h3 className="text-[17px] font-black text-white leading-tight">Que tu negocio aparezca en OficiosGo!</h3>
              <p className="text-[12px] text-gray-400 mt-2 leading-relaxed">Miles de vecinos de Villa Maria buscan servicios aca. Tu marca visible donde importa.</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <span className="text-[12px] font-bold text-white">Consultanos por WhatsApp</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F8C927" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          </div>
        </a>
      </section>
    </>
  );
}