import Link from "next/link";
import { Suspense } from "react";
import { searchService } from "@/server/services/search.service";
import { categoryRepository } from "@/server/repositories/category.repository";
import { GeoSearchButton, DistanceBadge } from "@/components/features/geo-search";
import { TransporteDropdown } from "@/components/features/transporte-dropdown";

type Props = {
  searchParams: Promise<{ category?: string; q?: string; page?: string; lat?: string; lng?: string; radius?: string }>;
};

const TRANSPORTE_SLUGS = ["comisionistas", "fleteros", "transporte-escolar", "cadetes", "transporte-privado"];

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category || null;
  const query = params.q || null;
  const page = Number(params.page ?? 1);
  const lat = params.lat ? parseFloat(params.lat) : null;
  const lng = params.lng ? parseFloat(params.lng) : null;
  const radius = params.radius ? parseFloat(params.radius) : 50;
  const hasGeo = lat != null && lng != null;
  const hasSearch = category || query;

  const categories = await categoryRepository.getAll();

  const result = hasSearch
    ? await searchService.search({ category, query, lat, lng, radius, page, limit: 20 })
    : null;

  const selectedCategory = category ? categories.find(c => c.slug === category) : null;

  // Separate main categories from transport subcategories
  const mainCategories = categories.filter(c => !TRANSPORTE_SLUGS.includes(c.slug) && c.slug !== "transporte");
  const transporteParent = categories.find(c => c.slug === "transporte");
  const transporteSubs = categories.filter(c => TRANSPORTE_SLUGS.includes(c.slug));
  const isTransporteSub = category ? TRANSPORTE_SLUGS.includes(category) : false;

  return (
    <>
      {/* Header */}
      <div className="bg-[#1A1D2E] px-5 pt-4 pb-5 rounded-b-[20px]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-black text-[#F8C927]">
            {selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : "Servicios"}
          </h1>
          {selectedCategory && (
            <Link href={isTransporteSub ? "/app/buscar?category=transporte" : "/app/buscar"} className="text-xs font-bold text-white/60 bg-white/10 px-3 py-1.5 rounded-full">
              ← {isTransporteSub ? "Transporte" : "Todos los oficios"}
            </Link>
          )}
        </div>

        <form method="GET" className="flex bg-white/10 rounded-xl overflow-hidden border border-white/10">
          <div className="flex-1 flex items-center gap-2 px-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input name="q" defaultValue={query ?? ""} placeholder={selectedCategory ? `Buscar en ${selectedCategory.name}...` : "Buscar servicio o profesional..."} className="flex-1 py-3 bg-transparent text-white text-sm placeholder:text-white/40 outline-none" />
          </div>
          {category && <input type="hidden" name="category" value={category} />}
          {lat && <input type="hidden" name="lat" value={lat} />}
          {lng && <input type="hidden" name="lng" value={lng} />}
          <button type="submit" className="px-5 bg-[#F8C927] text-[#1A1D2E] text-sm font-bold">Buscar</button>
        </form>

        {hasSearch && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            <Suspense fallback={null}><GeoSearchButton /></Suspense>
            <div className="w-px bg-white/15 shrink-0 my-1" />
            <Link href="/app/buscar" className="shrink-0 px-3.5 py-2 rounded-full text-xs font-bold bg-white/10 text-white border border-white/15">Todos</Link>
            {categories.filter(c => !TRANSPORTE_SLUGS.includes(c.slug)).map((cat) => (
              <Link key={cat.id} href={`/app/buscar?category=${cat.slug}${query ? `&q=${query}` : ""}${hasGeo ? `&lat=${lat}&lng=${lng}` : ""}`} className={`shrink-0 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap ${category === cat.slug || (cat.slug === "transporte" && isTransporteSub) ? "bg-white text-[#1A1D2E] shadow-md" : "bg-white/10 text-white border border-white/15"}`}>
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── CATEGORIES GRID (no category selected) ── */}
      {!hasSearch && (
        <div className="px-4 pt-5 pb-28">
          <p className="text-sm text-gray-500 mb-4 px-1">Elegí un oficio para ver los profesionales disponibles</p>
          <div className="grid grid-cols-2 gap-3">
            {mainCategories.map((cat) => (
              <Link key={cat.id} href={`/app/buscar?category=${cat.slug}`} className="relative overflow-hidden rounded-2xl p-6 text-center border border-gray-100 bg-white shadow-sm active:scale-[0.97] transition-transform">
                <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-[#F8C927]/10" />
                <div className="text-4xl mb-2.5 drop-shadow-sm">{cat.icon}</div>
                <div className="text-[15px] font-extrabold text-[#1A1D2E]">{cat.name}</div>
                <div className="text-[11px] text-gray-400 mt-1 font-medium">{cat._count.profiles} profesional{cat._count.profiles !== 1 ? "es" : ""}</div>
              </Link>
            ))}

            {/* Transporte dropdown card */}
            {transporteParent && (
              <TransporteDropdown
                parent={transporteParent}
                subs={transporteSubs.map(s => ({ id: s.id, name: s.name, slug: s.slug, icon: s.icon, count: s._count.profiles }))}
              />
            )}
          </div>
        </div>
      )}

      {/* ── TRANSPORTE SUBCATEGORIES (when transporte selected) ── */}
      {category === "transporte" && (
        <div className="px-4 pt-5 pb-28">
          <p className="text-sm text-gray-500 mb-4 px-1">Elegí el tipo de transporte</p>
          <div className="grid grid-cols-2 gap-3">
            {transporteSubs.map((cat) => (
              <Link key={cat.id} href={`/app/buscar?category=${cat.slug}`} className="relative overflow-hidden rounded-2xl p-6 text-center border border-gray-100 bg-white shadow-sm active:scale-[0.97] transition-transform">
                <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-[#F8C927]/10" />
                <div className="text-4xl mb-2.5 drop-shadow-sm">{cat.icon}</div>
                <div className="text-[15px] font-extrabold text-[#1A1D2E]">{cat.name}</div>
                <div className="text-[11px] text-gray-400 mt-1 font-medium">{cat._count.profiles} profesional{cat._count.profiles !== 1 ? "es" : ""}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── RESULTS (specific category selected) ── */}
      {hasSearch && result && category !== "transporte" && (
        <div className="px-5 pb-24 pt-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400">
              {result.total} profesional{result.total !== 1 ? "es" : ""}
              {selectedCategory ? ` en ${selectedCategory.name}` : ""}
              {hasGeo && ` · dentro de ${radius} km`}
            </p>
            {hasGeo && (
              <span className="text-[10px] text-[#7A9263] font-semibold flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                Por cercanía
              </span>
            )}
          </div>

          {result.data.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-[#1A1D2E] mb-1">Sin resultados</h3>
              <p className="text-sm text-gray-400 mb-5">
                {hasGeo ? `No hay profesionales dentro de ${radius} km.` : "No hay profesionales en esta categoría todavía"}
              </p>
              <Link href="/app/buscar" className="text-sm font-bold text-[#F8C927] bg-[#1A1D2E] px-5 py-2.5 rounded-xl inline-block">Ver todos los oficios</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {result.data.map((pro: any) => (
                <Link key={pro.id} href={`/app/profesional/${pro.slug}`} className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white border shadow-sm active:scale-[0.98] transition-transform ${pro.tier === "PREMIUM" ? "border-[#F8C927]/30" : "border-gray-200"}`}>
                  <div className="w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white font-black text-sm shrink-0">
                    {pro.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold text-[#1A1D2E] truncate">{pro.user.name}</span>
                      {pro.tier === "PREMIUM" && <span className="text-[8px] font-extrabold bg-[#F8C927] text-[#1A1D2E] px-1.5 py-px rounded uppercase shrink-0">Premium</span>}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{pro.city}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[#F8C927] text-xs">★</span>
                        <span className="text-xs font-bold">{Number(pro.averageRating).toFixed(1)}</span>
                        <span className="text-[10px] text-gray-400">({pro.totalReviews})</span>
                      </div>
                      {pro.urgencias24hs && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-100">🚨 24hs</span>}
                      {pro.distance != null && <DistanceBadge distance={pro.distance} />}
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </Link>
              ))}
            </div>
          )}

          {result.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {page > 1 && <Link href={`/app/buscar?category=${category ?? ""}&q=${query ?? ""}&page=${page - 1}${hasGeo ? `&lat=${lat}&lng=${lng}` : ""}`} className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-bold text-gray-600">← Anterior</Link>}
              <span className="px-4 py-2 text-xs text-gray-400">{page} de {result.totalPages}</span>
              {page < result.totalPages && <Link href={`/app/buscar?category=${category ?? ""}&q=${query ?? ""}&page=${page + 1}${hasGeo ? `&lat=${lat}&lng=${lng}` : ""}`} className="px-4 py-2 rounded-lg bg-[#1A1D2E] text-sm font-bold text-[#F8C927]">Siguiente →</Link>}
            </div>
          )}
        </div>
      )}
    </>
  );
}