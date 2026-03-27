import Link from "next/link";
import type { Metadata } from "next";
import { searchService } from "@/server/services/search.service";
import { categoryRepository } from "@/server/repositories/category.repository";

type Props = {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
};

const AVATAR_GRADIENTS = [
  ["#5C80BC", "#3a5a96"], ["#F5A623", "#c97d10"], ["#7A9263", "#506048"],
  ["#BC5C80", "#963a5a"], ["#5CBCBC", "#3a9696"], ["#9C5CBC", "#7a3a96"],
];

function getProImage(pro: any): string | null {
  return pro.profileImage || pro.photos?.[0]?.url || null;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const categories = await categoryRepository.getAll();
  const selected = params.category ? categories.find((c) => c.slug === params.category) : null;
  if (selected) {
    return {
      title: `${selected.name} en Villa Maria | OficiosGo`,
      description: `Encontra ${selected.name.toLowerCase()} verificados en Villa Maria, Córdoba. Opiniones reales, contacto directo.`,
    };
  }
  return {
    title: "Buscar profesionales en Villa Maria | OficiosGo",
    description: "Busca plomeros, electricistas, pintores y mas en Villa Maria, Córdoba.",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category || null;
  const query = params.q || null;
  const page = Number(params.page ?? 1);
  const hasSearch = !!(category || query);

  const [categories, result] = await Promise.all([
    categoryRepository.getAll(),
    hasSearch
      ? searchService.search({ category, query, page, limit: 20 })
      : Promise.resolve(null),
  ]);

  const selectedCategory = category ? categories.find((c) => c.slug === category) : null;

  return (
    <>
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-4 rounded-b-[24px]" style={{ background: "linear-gradient(175deg, #0F1120 0%, #1E2035 100%)" }}>
        <div className="flex items-center justify-between mb-3 gap-2">
          <h1 className="text-[18px] font-black text-white leading-tight truncate">
            {selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : query ? `"${query}"` : "Que necesitas?"}
          </h1>
          {selectedCategory && (
            <Link href="/app/buscar" className="shrink-0 text-[11px] font-bold text-white/60 bg-white/10 px-3 py-1.5 rounded-full whitespace-nowrap active:scale-[0.97] transition-transform">
              Ver todos
            </Link>
          )}
        </div>

        <form method="GET" className="flex bg-white/10 rounded-2xl overflow-hidden border border-white/10">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 min-w-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" className="shrink-0"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input
              name="q"
              defaultValue={query ?? ""}
              placeholder={selectedCategory ? `Buscar en ${selectedCategory.name}...` : "Plomero, electricista, pintor..."}
              className="flex-1 py-3 bg-transparent text-white text-sm placeholder:text-white/35 outline-none min-w-0"
              autoComplete="off"
            />
          </div>
          {category && <input type="hidden" name="category" value={category} />}
          <button type="submit" className="shrink-0 px-4 bg-[#F8C927] text-[#0F1120] text-sm font-extrabold active:bg-[#e8b800] transition-colors">
            Buscar
          </button>
        </form>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          <Link href="/app/buscar" className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors ${!category ? "bg-white text-[#0F1120] shadow-md" : "bg-white/10 text-white/80 border border-white/15"}`}>
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/app/buscar?category=${cat.slug}`}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors ${category === cat.slug ? "bg-white text-[#0F1120] shadow-md" : "bg-white/10 text-white/80 border border-white/15"}`}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Categories grid ── */}
      {!hasSearch && (
        <div className="px-4 pt-5 pb-24">
          <p className="text-[13px] text-gray-400 mb-4 font-medium">{categories.length} categorias disponibles</p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/app/buscar?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl p-5 border border-gray-100 bg-white shadow-sm active:scale-[0.97] transition-transform">
                <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-[#F8C927]/10" />
                <div className="text-3xl mb-2 relative z-10">{cat.icon}</div>
                <div className="text-[14px] font-extrabold text-[#0F1120] leading-tight relative z-10">{cat.name}</div>
                <div className="text-[11px] text-gray-400 mt-1 font-medium relative z-10">
                  {cat._count.profiles} {cat._count.profiles !== 1 ? "profesionales" : "profesional"}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F8C927] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {hasSearch && result && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-[12px] text-gray-500 font-medium mb-3">
            <span className="font-extrabold text-[#0F1120]">{result.total}</span> {result.total !== 1 ? "profesionales" : "profesional"}
            {selectedCategory ? ` en ${selectedCategory.name}` : ""}
          </p>

          {result.data.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-[17px] font-black text-[#0F1120] mb-1">Sin resultados</h2>
              <p className="text-[13px] text-gray-400 mb-6">Todavia no hay profesionales en esta categoria</p>
              <Link href="/app/buscar" className="inline-block py-3 px-6 rounded-xl bg-[#0F1120] text-[#F8C927] text-sm font-extrabold">
                Ver todos los oficios
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {result.data.map((pro: any, i: number) => {
                const img = getProImage(pro);
                const [from, to] = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
                const initials = pro.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
                return (
                  <Link key={pro.id} href={`/app/profesional/${pro.slug}`} className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white border shadow-sm active:scale-[0.98] transition-transform ${pro.tier === "PREMIUM" ? "border-[#F8C927]/40 shadow-[#F8C927]/5" : "border-gray-100"}`}>
                    <div className="shrink-0">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={pro.user.name} className="w-[52px] h-[52px] rounded-[14px] object-cover" loading="lazy" />
                      ) : (
                        <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-white font-black text-sm" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
                          {initials}
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
                      <div className="text-[12px] text-gray-500 mt-0.5 truncate">
                        {pro.category.name}{pro.city ? ` · ${pro.city}` : ""}{pro.yearsExperience ? ` · ${pro.yearsExperience} años` : ""}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="text-[#F8C927] text-[11px]">★</span>
                          <span className="text-[12px] font-bold text-[#0F1120]">{Number(pro.averageRating).toFixed(1)}</span>
                          <span className="text-[11px] text-gray-400">({pro.totalReviews})</span>
                        </div>
                        {pro.urgencias24hs && (
                          <span className="text-[9px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-100">🚨 24hs</span>
                        )}
                      </div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
                  </Link>
                );
              })}
            </div>
          )}

          {result.totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 mt-5">
              {page > 1 ? (
                <Link href={`/app/buscar?${category ? `category=${category}&` : ""}${query ? `q=${query}&` : ""}page=${page - 1}`} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-[13px] font-bold text-gray-600 text-center active:scale-[0.98] transition-transform">
                  Anterior
                </Link>
              ) : <div className="flex-1" />}
              <span className="text-[12px] text-gray-400 font-medium shrink-0 px-2">{page} / {result.totalPages}</span>
              {page < result.totalPages ? (
                <Link href={`/app/buscar?${category ? `category=${category}&` : ""}${query ? `q=${query}&` : ""}page=${page + 1}`} className="flex-1 py-2.5 rounded-xl bg-[#0F1120] text-[13px] font-extrabold text-[#F8C927] text-center active:scale-[0.98] transition-transform">
                  Siguiente
                </Link>
              ) : <div className="flex-1" />}
            </div>
          )}
        </div>
      )}

      <div className="h-24" />
    </>
  );
}