"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: { profiles: number };
};

type SuggestionCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  count: number;
};

type SuggestionProfessional = {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  categoryIcon: string | null;
  profileImage: string | null;
  tier: string;
};

type RecentSearch = {
  q: string | null;
  category: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
  timestamp: number;
};

type ActiveFilters = { urgencias: boolean; garantia: boolean; matriculado: boolean };

type Props = {
  categories: Category[];
  initialQuery: string | null;
  initialCategory: string | null;
  selectedCategory: Category | null;
  totalResults: number | null;
  hasSearch: boolean;
  initialFilters: ActiveFilters;
};

const RECENT_KEY = "oficiosgo:recent-searches";
const MAX_RECENT = 5;
const DEBOUNCE_MS = 250;

type UrlFilters = { urgencias?: boolean; garantia?: boolean; matriculado?: boolean };

function buildUrl(params: {
  category?: string | null;
  q?: string | null;
  filters?: UrlFilters;
}): string {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.q) sp.set("q", params.q);
  if (params.filters?.urgencias) sp.set("urgencias", "1");
  if (params.filters?.garantia) sp.set("garantia", "1");
  if (params.filters?.matriculado) sp.set("matriculado", "1");
  const qs = sp.toString();
  return `/app/buscar${qs ? `?${qs}` : ""}`;
}

function loadRecent(): RecentSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecent(search: RecentSearch) {
  if (typeof window === "undefined") return;
  if (!search.q && !search.category) return;
  try {
    const current = loadRecent();
    const filtered = current.filter(
      (r) => !(r.q === search.q && r.category === search.category)
    );
    const updated = [search, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {}
}

export function SearchBar({
  categories,
  initialQuery,
  initialCategory,
  selectedCategory,
  totalResults,
  hasSearch,
  initialFilters,
}: Props) {
  const router = useRouter();
  const activeFilters = initialFilters;
  const [isPending, startTransition] = useTransition();
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(initialQuery ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    categories: SuggestionCategory[];
    professionals: SuggestionProfessional[];
  }>({ categories: [], professionals: [] });
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const lastSavedRef = useRef<string>("");

  // Track mount status
  useEffect(() => {
    isMountedRef.current = true;
    setMounted(true);
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load recent searches on mount
  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  // Save current search to recents
  useEffect(() => {
    if (!hasSearch) return;
    const key = `${initialQuery ?? ""}|${initialCategory ?? ""}`;
    if (key === lastSavedRef.current) return;
    lastSavedRef.current = key;

    saveRecent({
      q: initialQuery,
      category: initialCategory,
      categoryName: selectedCategory?.name ?? null,
      categoryIcon: selectedCategory?.icon ?? null,
      timestamp: Date.now(),
    });
    setRecent(loadRecent());
  }, [initialQuery, initialCategory, hasSearch, selectedCategory]);

  // Sync input value when URL changes
  useEffect(() => {
    setInputValue(initialQuery ?? "");
  }, [initialQuery]);

  // Clear pending category once navigation completes
  useEffect(() => {
    setPendingCategory(null);
  }, [initialCategory]);

  // Debounced autocomplete fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    const trimmed = inputValue.trim();
    if (trimmed.length < 2) {
      setSuggestions({ categories: [], professionals: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (!isMountedRef.current || controller.signal.aborted) return;
        setSuggestions({
          categories: data.categories ?? [],
          professionals: data.professionals ?? [],
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        if (!isMountedRef.current) return;
        setSuggestions({ categories: [], professionals: [] });
      } finally {
        if (isMountedRef.current && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  // Cleanup pending requests on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, []);

  const navigate = useCallback(
    (url: string, categorySlug?: string | null) => {
      if (categorySlug !== undefined) setPendingCategory(categorySlug);
      startTransition(() => {
        router.push(url);
      });
    },
    [router]
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = inputValue.trim();
      setIsFocused(false);
      inputRef.current?.blur();
      navigate(buildUrl({ category: initialCategory, q: trimmed || null, filters: activeFilters }));
    },
    [inputValue, initialCategory, navigate, activeFilters]
  );

  const toggleFilter = useCallback(
    (key: keyof ActiveFilters) => {
      const next = { ...activeFilters, [key]: !activeFilters[key] };
      navigate(buildUrl({ category: initialCategory, q: initialQuery, filters: next }));
    },
    [activeFilters, initialCategory, initialQuery, navigate]
  );

  const hasActiveFilter = activeFilters.urgencias || activeFilters.garantia || activeFilters.matriculado;

  const clearFilters = useCallback(() => {
    navigate(buildUrl({ category: initialCategory, q: initialQuery }));
  }, [initialCategory, initialQuery, navigate]);

  const handleClear = useCallback(() => {
    setInputValue("");
    setSuggestions({ categories: [], professionals: [] });
    inputRef.current?.focus();
  }, []);

  const handleRemoveRecent = useCallback((idx: number) => {
    try {
      const current = loadRecent();
      const updated = current.filter((_, i) => i !== idx);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      setRecent(updated);
    } catch {}
  }, []);

  const handleClearAllRecent = useCallback(() => {
    try {
      localStorage.removeItem(RECENT_KEY);
      setRecent([]);
    } catch {}
  }, []);

  // Prefetch on touch/hover for instant navigation
  const handlePrefetch = useCallback(
    (url: string) => {
      router.prefetch(url);
    },
    [router]
  );

  const trimmedInput = inputValue.trim();
  const showDropdown =
    mounted &&
    isFocused &&
    (trimmedInput.length >= 2
      ? suggestions.categories.length > 0 ||
        suggestions.professionals.length > 0 ||
        isLoading
      : recent.length > 0);

  const showSubtitle = hasSearch && totalResults !== null && totalResults > 0;

  // Effective active category for optimistic UI
  const effectiveCategory = pendingCategory !== null ? pendingCategory : initialCategory;

  return (
    <div
      className="sticky top-0 z-30 px-4 pt-4 pb-4 rounded-b-[24px]"
      style={{ background: "linear-gradient(175deg, #0F1120 0%, #1E2035 100%)" }}
    >
      <div className="flex items-center justify-between mb-1 gap-2">
        <h1 className="text-[18px] font-black text-white leading-tight truncate">
          {selectedCategory
            ? `${selectedCategory.icon ?? ""} ${selectedCategory.name}`
            : initialQuery
            ? `"${initialQuery}"`
            : "¿Qué necesitás?"}
        </h1>
        {selectedCategory && (
          <button
            type="button"
            onClick={() => navigate(buildUrl({ q: initialQuery, filters: activeFilters }), null)}
            className="shrink-0 text-[11px] font-bold text-white/60 bg-white/10 px-3 py-1.5 rounded-full whitespace-nowrap active:scale-[0.97] transition-transform"
            aria-label="Quitar filtro de categoría"
          >
            Ver todos
          </button>
        )}
      </div>

      {showSubtitle ? (
        <p className="text-[11px] text-white/50 font-medium mb-3">
          {totalResults} {totalResults !== 1 ? "profesionales" : "profesional"}
          {selectedCategory ? " verificados" : ""} en Villa María y Villa Nueva
        </p>
      ) : (
        <div className="mb-3" />
      )}

      {/* Search input + dropdown */}
      <div ref={containerRef} className="relative">
        <form
          onSubmit={handleSubmit}
          role="search"
          className="flex bg-white/10 rounded-2xl overflow-hidden border border-white/10"
        >
          <label htmlFor="search-input" className="sr-only">
            Buscar profesionales
          </label>
          <div className="flex-1 flex items-center gap-2.5 px-3.5 min-w-0">
            {isLoading || isPending ? (
              <div
                className="shrink-0 w-4 h-4 border-2 border-white/20 border-t-[#F8C927] rounded-full animate-spin"
                aria-hidden="true"
              />
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                className="shrink-0"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            )}
            <input
              ref={inputRef}
              id="search-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={
                selectedCategory
                  ? `Buscar en ${selectedCategory.name}...`
                  : "Plomero, electricista, pintor..."
              }
              className="flex-1 py-3 bg-transparent text-white text-sm placeholder:text-white/35 outline-none min-w-0"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="search"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white/15 active:bg-white/25 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="shrink-0 px-4 bg-[#F8C927] text-[#0F1120] text-sm font-extrabold active:bg-[#e8b800] transition-colors disabled:opacity-70"
            aria-label="Ejecutar búsqueda"
          >
            Buscar
          </button>
        </form>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[70vh] overflow-y-auto z-40">
            {trimmedInput.length < 2 && recent.length > 0 && (
              <div className="p-3">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wide">
                    Búsquedas recientes
                  </span>
                  <button
                    type="button"
                    onClick={handleClearAllRecent}
                    className="text-[10px] font-bold text-gray-400 active:text-gray-600"
                  >
                    Borrar todas
                  </button>
                </div>
                <div className="flex flex-col gap-0.5">
                  {recent.map((r, i) => (
                    <div
                      key={`${r.q}-${r.category}-${r.timestamp}`}
                      className="flex items-center gap-2 rounded-xl active:bg-gray-50"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsFocused(false);
                          navigate(buildUrl({ category: r.category, q: r.q }));
                        }}
                        className="flex-1 flex items-center gap-3 px-3 py-2.5 min-w-0 text-left"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          className="shrink-0"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        <span className="text-[13px] font-semibold text-[#0F1120] truncate">
                          {r.q || r.categoryName}
                          {r.q && r.categoryName && (
                            <span className="text-gray-400 font-normal">
                              {" "}
                              en {r.categoryName}
                            </span>
                          )}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecent(i)}
                        className="shrink-0 w-7 h-7 flex items-center justify-center mr-1 rounded-full active:bg-gray-100"
                        aria-label="Quitar de recientes"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="3"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {trimmedInput.length >= 2 && (
              <>
                {suggestions.categories.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="px-2 mb-2 text-[11px] font-extrabold text-gray-400 uppercase tracking-wide">
                      Categorías
                    </div>
                    <div className="flex flex-col">
                      {suggestions.categories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setIsFocused(false);
                            navigate(buildUrl({ category: c.slug, filters: activeFilters }), c.slug);
                          }}
                          onMouseEnter={() => handlePrefetch(buildUrl({ category: c.slug, filters: activeFilters }))}
                          onTouchStart={() => handlePrefetch(buildUrl({ category: c.slug, filters: activeFilters }))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl active:bg-gray-50 text-left"
                        >
                          <span className="text-xl shrink-0" aria-hidden="true">
                            {c.icon}
                          </span>
                          <span className="flex-1 text-[13px] font-extrabold text-[#0F1120] truncate">
                            {c.name}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 shrink-0">
                            {c.count} {c.count !== 1 ? "pros" : "pro"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.professionals.length > 0 && (
                  <div className="p-3">
                    <div className="px-2 mb-2 text-[11px] font-extrabold text-gray-400 uppercase tracking-wide">
                      Profesionales
                    </div>
                    <div className="flex flex-col">
                      {suggestions.professionals.map((p) => (
                        <Link
                          key={p.id}
                          href={`/app/profesional/${p.slug}`}
                          onClick={() => setIsFocused(false)}
                          onMouseEnter={() => handlePrefetch(`/app/profesional/${p.slug}`)}
                          onTouchStart={() => handlePrefetch(`/app/profesional/${p.slug}`)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl active:bg-gray-50"
                        >
                          {p.profileImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.profileImage}
                              alt={p.name}
                              className="w-9 h-9 rounded-full object-cover shrink-0"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5C80BC] to-[#3a5a96] flex items-center justify-center text-white font-black text-xs shrink-0">
                              {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-extrabold text-[#0F1120] truncate">
                                {p.name}
                              </span>
                              {p.tier === "PREMIUM" && (
                                <span className="text-[7px] font-extrabold bg-gradient-to-r from-[#F5A623] to-[#F8C927] text-[#0F1120] px-1 py-[1px] rounded uppercase tracking-wide shrink-0">
                                  Premium
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500 truncate">
                              {p.categoryIcon} {p.categoryName}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {!isLoading &&
                  suggestions.categories.length === 0 &&
                  suggestions.professionals.length === 0 && (
                    <div className="p-6 text-center">
                      <div className="text-2xl mb-1">🤷</div>
                      <p className="text-[12px] text-gray-400">
                        Sin sugerencias para "{trimmedInput}"
                      </p>
                      <button
                        type="button"
                        onClick={() => handleSubmit()}
                        className="mt-3 text-[12px] font-extrabold text-[#0F1120] underline"
                      >
                        Buscar igual
                      </button>
                    </div>
                  )}

                {isLoading &&
                  suggestions.categories.length === 0 &&
                  suggestions.professionals.length === 0 && (
                    <div className="p-6 text-center">
                      <div className="inline-block w-5 h-5 border-2 border-gray-200 border-t-[#0F1120] rounded-full animate-spin" />
                    </div>
                  )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Category chips with optimistic UI + prefetch on touch */}
      <div
        className="flex gap-2 mt-3 overflow-x-auto pb-0.5"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(buildUrl({ q: initialQuery, filters: activeFilters }), null)}
          onMouseEnter={() => handlePrefetch(buildUrl({ q: initialQuery, filters: activeFilters }))}
          onTouchStart={() => handlePrefetch(buildUrl({ q: initialQuery, filters: activeFilters }))}
          aria-pressed={!effectiveCategory}
          className={`shrink-0 px-3.5 py-2.5 min-h-[40px] rounded-full text-[12px] font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            !effectiveCategory
              ? "bg-white text-[#0F1120] shadow-md"
              : "bg-white/10 text-white/80 border border-white/15"
          }`}
        >
          <span>Todos</span>
          {pendingCategory === null && isPending && !initialCategory && (
            <span className="w-3 h-3 border-2 border-[#0F1120]/30 border-t-[#0F1120] rounded-full animate-spin" />
          )}
        </button>
        {categories.map((cat) => {
          const isActive = effectiveCategory === cat.slug;
          const isThisPending = pendingCategory === cat.slug && isPending;
          const url = buildUrl({ category: cat.slug, q: initialQuery, filters: activeFilters });
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(url, cat.slug)}
              onMouseEnter={() => handlePrefetch(url)}
              onTouchStart={() => handlePrefetch(url)}
              aria-pressed={isActive}
              aria-label={`Filtrar por ${cat.name}, ${cat._count.profiles} profesionales`}
              className={`shrink-0 px-3.5 py-2.5 min-h-[40px] rounded-full text-[12px] font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? "bg-white text-[#0F1120] shadow-md"
                  : "bg-white/10 text-white/80 border border-white/15"
              }`}
              style={{ touchAction: "manipulation" }}
            >
              <span>
                {cat.icon} {cat.name}
              </span>
              {isThisPending ? (
                <span className="w-3 h-3 border-2 border-[#0F1120]/30 border-t-[#0F1120] rounded-full animate-spin" />
              ) : (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-[1px] rounded-full ${
                    isActive
                      ? "bg-[#0F1120]/10 text-[#0F1120]"
                      : "bg-white/15 text-white/70"
                  }`}
                >
                  {cat._count.profiles}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filtros de confianza (toggles) */}
      <div
        className="flex gap-2 mt-2.5 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
      >
        {([
          { key: "urgencias", label: "Urgencias 24hs", icon: "⚡" },
          { key: "garantia", label: "Con garantía", icon: "🛡️" },
          { key: "matriculado", label: "Matriculado", icon: "🪪" },
        ] as const).map((f) => {
          const isActive = activeFilters[f.key];
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => toggleFilter(f.key)}
              aria-pressed={isActive}
              style={{ touchAction: "manipulation" }}
              className={`shrink-0 px-3.5 py-2 min-h-[38px] rounded-full text-[12px] font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#F8C927] text-[#0F1120] shadow-md"
                  : "bg-white/10 text-white/80 border border-white/15"
              }`}
            >
              <span>{f.icon} {f.label}</span>
              {isActive && (
                <span className="text-[13px] leading-none" aria-hidden="true">✕</span>
              )}
            </button>
          );
        })}
        {hasActiveFilter && (
          <button
            type="button"
            onClick={clearFilters}
            style={{ touchAction: "manipulation" }}
            className="shrink-0 px-3 py-2 min-h-[38px] rounded-full text-[12px] font-bold whitespace-nowrap text-white/60 underline underline-offset-2 active:text-white transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}