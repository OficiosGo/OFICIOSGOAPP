import Link from "next/link";
import { Suspense } from "react";
import { searchService } from "@/server/services/search.service";
import { categoryRepository } from "@/server/repositories/category.repository";
import { GeoSearchButton, DistanceBadge } from "@/components/features/geo-search";

type Props = {
  searchParams: Promise<{ category?: string; q?: string; page?: string; lat?: string; lng?: string; radius?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category || null;
  const query = params.q || null;
  const page = Number(params.page ?? 1);
  const lat = params.lat ? parseFloat(params.lat) : null;
  const lng = params.lng ? parseFloat(params.lng) : null;
  const radius = params.radius ? parseFloat(params.radius) : 50;
  const hasGeo = lat != null && lng != null;

  const [result, categories] = await Promise.all([
    searchService.search({ category, query, lat, lng, radius, page, limit: 20 }),
    categoryRepository.getAll(),
  ]);

  return (
    <>
      {/* Header */}
      <div className="bg-[#1A1D2E] px-5 pt-4 pb-5 rounded-b-[20px]">
        <h1 className="text-xl font-black text-[#F8C927] mb-3">Servicios</h1>

        <form method="GET" className="flex bg-white/10 rounded-xl overflow-hidden border border-white/10">
          <div className="flex-1 flex items-center gap-2 px-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input
              name="q"
              defaultValue={query ?? ""}
              placeholder="Buscar servicio..."
              className="flex-1 py-3 bg-transparent text-white text-sm placeholder:text-white/40 outline-none"
            />
          </div>
          {category && <input type="hidden" name="category" value={category} />}
          {lat && <input type="hidden" name="lat" value={lat} />}
          {lng && <input type="hidden" name="lng" value={lng} />}
          <button type="submit" className="px-5 bg-[#F8C927] text-[#1A1D2E] text-sm font-bold">
            Buscar
          </button>
        </form>

        {/* Geo button + category chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <Suspense fallback={null}>
            <GeoSearchButton />
          </Suspense>
          <div className="w-px bg-white/15 shrink-0 my-1" />
          <Link
            href="/app/buscar"
            className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-bold ${
              !category ? "bg-white text-[#1A1D2E] shadow-md" : "bg-white/10 text-white border border-white/15"
            }`}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/app/buscar?category=${cat.slug}${query ? `&q=${query}` : ""}${hasGeo ? `&lat=${lat}&lng=${lng}` : ""}`}
              className={`shrink-0 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap ${
                category === cat.slug ? "bg-white text-[#1A1D2E] shadow-md" : "bg-white/10 text-white border border-white/15"
              }`}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-5 pb-24 pt-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400">
            {result.total} resultado{result.total !== 1 ? "s" : ""}
            {hasGeo && ` · dentro de ${radius} km`}
          </p>
          {hasGeo && (
            <span className="text-[10px] text-[#7A9263] font-semibold flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
              Ordenado por cercanía
            </span>
          )}
        </div>

        {result.data.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-[#1A1D2E] mb-1">Sin resultados</h3>
            <p className="text-sm text-gray-400">
              {hasGeo
                ? `No hay profesionales dentro de ${radius} km. Probá desactivando "Cerca de mí".`
                : "Probá otra categoría o búsqueda"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {result.data.map((pro: any) => (
              <Link
                key={pro.id}
                href={`/app/profesional/${pro.slug}`}
                className={`flex items-center gap-3 p-3 rounded-2xl bg-white border shadow-sm ${
                  pro.tier === "PREMIUM" ? "border-[#F8C927]/30" : "border-gray-200"
                }`}
              >
                {pro.photos[0] ? (
                  <img src={pro.photos[0].url} alt={pro.user.name} className="w-[52px] h-[52px] rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white font-black text-sm shrink-0">
                    {pro.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-extrabold text-[#1A1D2E] truncate">{pro.user.name}</div>
                  <div className="text-[11px] text-gray-500">
                    {pro.category.name} · {pro.yearsExperience ?? 0} años
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[#F8C927] text-xs">★</span>
                      <span className="text-xs font-bold">{Number(pro.averageRating).toFixed(1)}</span>
                      <span className="text-[10px] text-gray-400">({pro.totalReviews})</span>
                    </div>
                    {pro.distance != null && (
                      <DistanceBadge distance={pro.distance} />
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {pro.tier === "PREMIUM" && (
                    <span className="text-[8px] font-extrabold bg-[#F8C927] text-[#1A1D2E] px-1.5 py-px rounded uppercase">Premium</span>
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </>
  );
}
