import Link from "next/link";
import type { Metadata } from "next";
import { searchService } from "@/server/services/search.service";
import { categoryRepository } from "@/server/repositories/category.repository";

import { TransporteDropdown } from "@/components/features/transporte-dropdown";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type SearchParams = {
  category?: string;
  q?: string;
  page?: string;
};

type Props = { searchParams: Promise<SearchParams> };

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const TRANSPORTE_SLUGS = [
  "comisionistas",
  "fleteros",
  "transporte-escolar",
  "cadetes",
  "transporte-privado",
];

// Gradients rotativos — evita que todos los avatares se vean iguales
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

const INITIALS = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC METADATA — SEO por categoría
// ─────────────────────────────────────────────────────────────────────────────
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const categories = await categoryRepository.getAll();
  const selected = params.category
    ? categories.find((c) => c.slug === params.category)
    : null;

  if (selected) {
    return {
      title: `${selected.name} en Villa María, Córdoba | OficiosGo!`,
      description: `Encontrá ${selected.name.toLowerCase()} verificados en Villa María, Córdoba. Reseñas reales, contacto directo y sin intermediarios.`,
    };
  }

  return {
    title: "Buscar profesionales de oficios en Villa María | OficiosGo!",
    description:
      "Buscá plomeros, electricistas, pintores, carpinteros y más en Villa María, Córdoba. Profesionales verificados con reseñas reales.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category || null;
  const query = params.q || null;
  const page = Number(params.page ?? 1);
  const hasSearch = !!(category || query);

  const categories = await categoryRepository.getAll();

  const result = hasSearch
    ? await searchService.search({ category, query, page, limit: 20 })
    : null;

  const selectedCategory = category
    ? categories.find((c) => c.slug === category)
    : null;

  const mainCategories = categories.filter(
    (c) => !TRANSPORTE_SLUGS.includes(c.slug) && c.slug !== "transporte"
  );
  const transporteParent = categories.find((c) => c.slug === "transporte");
  const transporteSubs = categories.filter((c) =>
    TRANSPORTE_SLUGS.includes(c.slug)
  );
  const isTransporteSub = category ? TRANSPORTE_SLUGS.includes(category) : false;

  // Helper: build URL preserving query params
  const buildUrl = (overrides: Record<string, string | null>) => {
    const base: Record<string, string> = {};
    if (category) base.category = category;
    if (query) base.q = query;
    const merged = { ...base, ...overrides };
    const qs = Object.entries(merged)
      .filter(([, v]) => v != null && v !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join("&");
    return `/app/buscar${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          HEADER — búsqueda + filtros de categoría
      ════════════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-20 px-4 pt-4 pb-4 rounded-b-[24px]"
        style={{
          background: "linear-gradient(175deg, #0F1120 0%, #1E2035 100%)",
        }}
      >
        {/* ── Title row ── */}
        <div className="flex items-center justify-between mb-3 gap-2">
          <h1 className="text-[18px] font-black text-white leading-tight truncate">
            {selectedCategory
              ? `${selectedCategory.icon} ${selectedCategory.name} en Villa María`
              : query
              ? `Resultados para "${query}"`
              : "¿Qué necesitás resolver?"}
          </h1>
          {(selectedCategory || isTransporteSub) && (
            <Link
              href={
                isTransporteSub
                  ? "/app/buscar?category=transporte"
                  : "/app/buscar"
              }
              className="shrink-0 text-[11px] font-bold text-white/60 bg-white/10 px-3 py-1.5 rounded-full whitespace-nowrap active:scale-[0.97] transition-transform"
            >
              ← {isTransporteSub ? "Transporte" : "Todos"}
            </Link>
          )}
        </div>

        {/* ── Search form ── */}
        <form
          method="GET"
          className="flex bg-white/10 rounded-2xl overflow-hidden border border-white/10"
        >
          <div className="flex-1 flex items-center gap-2.5 px-3.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              name="q"
              defaultValue={query ?? ""}
              placeholder={
                selectedCategory
                  ? `Buscar en ${selectedCategory.name}…`
                  : "Plomero, electricista, pintor…"
              }
              className="flex-1 py-3 bg-transparent text-white text-sm placeholder:text-white/35 outline-none"
              autoComplete="off"
              aria-label="Buscar profesional u oficio"
            />
          </div>
          {category && <input type="hidden" name="category" value={category} />}
          <button
            type="submit"
            className="px-5 bg-[#F8C927] text-[#0F1120] text-sm font-extrabold active:bg-[#e8b800] transition-colors"
            aria-label="Buscar"
          >
            Buscar
          </button>
        </form>

        {/* ── Category filter chips — SIEMPRE visibles ── */}
        <div
          className="flex gap-2 mt-3 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          role="list"
          aria-label="Filtrar por categoría"
        >
          <Link
            href={buildUrl({ category: null, page: null })}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors ${
              !category
                ? "bg-white text-[#0F1120] shadow-md"
                : "bg-white/10 text-white/80 border border-white/15"
            }`}
            role="listitem"
          >
            Todos
          </Link>
          {categories
            .filter((c) => !TRANSPORTE_SLUGS.includes(c.slug))
            .map((cat) => {
              const isActive =
                category === cat.slug ||
                (cat.slug === "transporte" && isTransporteSub);
              return (
                <Link
                  key={cat.id}
                  href={buildUrl({ category: cat.slug, page: null })}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-white text-[#0F1120] shadow-md"
                      : "bg-white/10 text-white/80 border border-white/15"
                  }`}
                  role="listitem"
                >
                  {cat.icon} {cat.name}
                </Link>
              );
            })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          GRID DE CATEGORÍAS (sin filtro activo)
      ════════════════════════════════════════════════════════════════ */}
      {!hasSearch && (
        <div className="px-4 pt-5 pb-safe-bottom">
          <p className="text-[13px] text-gray-400 mb-4 font-medium px-1">
            {categories.length} categorías de servicios en Villa María
          </p>
          <div className="grid grid-cols-2 gap-3">
            {mainCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/app/buscar?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl p-5 border border-gray-100 bg-white shadow-sm active:scale-[0.97] transition-transform"
              >
                <div
                  className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-[#F8C927]/10"
                  aria-hidden="true"
                />
                <div className="text-3xl mb-2 drop-shadow-sm relative z-10">
                  {cat.icon}
                </div>
                <div className="text-[14px] font-extrabold text-[#0F1120] leading-tight relative z-10">
                  {cat.name}
                </div>
                <div className="text-[11px] text-gray-400 mt-1 font-medium relative z-10">
                  {cat._count.profiles}{" "}
                  {cat._count.profiles !== 1 ? "profesionales" : "profesional"}
                </div>
                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F8C927] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}

            {transporteParent && (
              <TransporteDropdown
                parent={transporteParent}
                subs={transporteSubs.map((s) => ({
                  id: s.id,
                  name: s.name,
                  slug: s.slug,
                  icon: s.icon,
                  count: s._count.profiles,
                }))}
              />
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SUBCATEGORÍAS DE TRANSPORTE
      ════════════════════════════════════════════════════════════════ */}
      {category === "transporte" && (
        <div className="px-4 pt-5 pb-safe-bottom">
          <p className="text-[13px] text-gray-400 mb-4 font-medium px-1">
            Elegí el tipo de transporte que necesitás
          </p>
          <div className="grid grid-cols-2 gap-3">
            {transporteSubs.map((cat) => (
              <Link
                key={cat.id}
                href={`/app/buscar?category=${cat.slug}`}
                className="relative overflow-hidden rounded-2xl p-5 border border-gray-100 bg-white shadow-sm active:scale-[0.97] transition-transform"
              >
                <div
                  className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-[#F8C927]/10"
                  aria-hidden="true"
                />
                <div className="text-3xl mb-2 drop-shadow-sm relative z-10">
                  {cat.icon}
                </div>
                <div className="text-[14px] font-extrabold text-[#0F1120] leading-tight relative z-10">
                  {cat.name}
                </div>
                <div className="text-[11px] text-gray-400 mt-1 font-medium relative z-10">
                  {cat._count.profiles}{" "}
                  {cat._count.profiles !== 1 ? "profesionales" : "profesional"}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          RESULTADOS
      ════════════════════════════════════════════════════════════════ */}
      {hasSearch && result && category !== "transporte" && (
        <div className="px-4 pt-4 pb-safe-bottom">

          {/* ── Results meta ── */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
            <p className="text-[12px] text-gray-500 font-medium">
              <span className="font-extrabold text-[#0F1120]">
                {result.total}
              </span>{" "}
              {result.total !== 1 ? "profesionales" : "profesional"}
              {selectedCategory ? ` en ${selectedCategory.name}` : ""}
            </p>
          </div>

          {/* ── Empty state ── */}
          {result.data.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
              <h2 className="text-[17px] font-black text-[#0F1120] mb-1">
                Sin resultados por ahora
              </h2>
              <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
                Todavía no hay profesionales registrados en esta categoría en Villa María.
              </p>
              <div className="flex flex-col gap-2.5 max-w-[240px] mx-auto">
                <Link
                  href="/app/buscar"
                  className="py-3 rounded-xl bg-[#0F1120] text-[#F8C927] text-sm font-extrabold text-center"
                >
                  Ver todos los oficios
                </Link>
                <a
                  href="https://wa.me/5493535698990?text=Hola%2C%20necesito%20un%20profesional%20de%20este%20oficio%20en%20Villa%20Mar%C3%ADa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 rounded-xl bg-[#25D366] text-white text-sm font-extrabold text-center flex items-center justify-center gap-2"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  Pedí por WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {result.data.map((pro: any, i: number) => {
                const [from, to] =
                  AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
                return (
                  <Link
                    key={pro.id}
                    href={`/app/profesional/${pro.slug}`}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white border shadow-sm active:scale-[0.98] transition-transform ${
                      pro.tier === "PREMIUM"
                        ? "border-[#F8C927]/40 shadow-[#F8C927]/5"
                        : "border-gray-100"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-white font-black text-sm shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${from}, ${to})`,
                      }}
                      aria-hidden="true"
                    >
                      {INITIALS(pro.user.name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14px] font-extrabold text-[#0F1120] truncate">
                          {pro.user.name}
                        </span>
                        {pro.tier === "PREMIUM" && (
                          <span className="text-[8px] font-extrabold bg-gradient-to-r from-[#F5A623] to-[#F8C927] text-[#0F1120] px-1.5 py-[2px] rounded-md uppercase tracking-wide shrink-0">
                            Premium
                          </span>
                        )}
                      </div>

                      <div className="text-[12px] text-gray-500 mt-0.5 truncate">
                        {pro.city || "Villa María"}
                      </div>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span
                            className="text-[#F8C927] text-[11px]"
                            aria-hidden="true"
                          >
                            ★
                          </span>
                          <span className="text-[12px] font-bold text-[#0F1120]">
                            {Number(pro.averageRating).toFixed(1)}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            ({pro.totalReviews}{" "}
                            {pro.totalReviews === 1 ? "reseña" : "reseñas"})
                          </span>
                        </div>
                        {pro.urgencias24hs && (
                          <span className="text-[9px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-100">
                            🚨 Urgencias 24hs
                          </span>
                        )}
                      </div>
                    </div>

                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#D1D5DB"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── Paginación ── */}
          {result.totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 mt-5">
              {page > 1 ? (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-[13px] font-bold text-gray-600 text-center active:scale-[0.98] transition-transform"
                >
                  ← Anterior
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              <span className="text-[12px] text-gray-400 font-medium shrink-0 px-2">
                {page} / {result.totalPages}
              </span>
              {page < result.totalPages ? (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="flex-1 py-2.5 rounded-xl bg-[#0F1120] text-[13px] font-extrabold text-[#F8C927] text-center active:scale-[0.98] transition-transform"
                >
                  Siguiente →
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Safe area spacer para iOS home indicator */}
      <div className="h-24" aria-hidden="true" />
    </>
  );
}