"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

type Professional = {
    id: string;
    slug: string;
    tier: string;
    city: string;
    yearsExperience: number | null;
    profileImage?: string | null;
    urgencias24hs?: boolean;
    conGarantia?: boolean;
    averageRating: number;
    totalReviews: number;
    user: { name: string };
    category: { name: string };
    photos?: { url: string }[];
  };

type SearchResult = {
  data: Professional[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type Props = {
  initialResult: SearchResult;
  category: string | null;
  query: string | null;
};

const AVATAR_GRADIENTS = [
  ["#5C80BC", "#3a5a96"],
  ["#F5A623", "#c97d10"],
  ["#7A9263", "#506048"],
  ["#BC5C80", "#963a5a"],
  ["#5CBCBC", "#3a9696"],
  ["#9C5CBC", "#7a3a96"],
];

function getProImage(pro: Professional): string | null {
  return pro.profileImage || pro.photos?.[0]?.url || null;
}

export function ResultsList({ initialResult, category, query }: Props) {
  const [items, setItems] = useState<Professional[]>(initialResult.data);
  const [page, setPage] = useState(initialResult.page);
  const [totalPages, setTotalPages] = useState(initialResult.totalPages);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Track mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reset state ONLY when search params actually change (not on every render)
  // We use category+query as the stable key, not initialResult (object ref changes every render)
  useEffect(() => {
    setItems(initialResult.data);
    setPage(initialResult.page);
    setTotalPages(initialResult.totalPages);
    setError(false);
    loadingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || page >= totalPages) return;
    loadingRef.current = true;
    setIsLoadingMore(true);
    setError(false);

    try {
      const sp = new URLSearchParams();
      if (category) sp.set("category", category);
      if (query) sp.set("q", query);
      sp.set("page", String(page + 1));
      sp.set("limit", "20");

      const res = await fetch(`/api/search?${sp.toString()}`);
      if (!res.ok) throw new Error("fetch failed");
      const data: SearchResult = await res.json();

      if (!isMountedRef.current) return;
      setItems((prev) => [...prev, ...data.data]);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      if (isMountedRef.current) setError(true);
    } finally {
      if (isMountedRef.current) setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, [page, totalPages, category, query]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || page >= totalPages) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, page, totalPages]);

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-5xl mb-4" aria-hidden="true">
          🔍
        </div>
        <h2 className="text-[17px] font-black text-[#0F1120] mb-1">Sin resultados</h2>
        <p className="text-[13px] text-gray-400 mb-6">
          {query
            ? `No encontramos profesionales para "${query}"`
            : "Todavía no hay profesionales en esta categoría"}
        </p>
        <Link
          href="/app/buscar"
          className="inline-block py-3 px-6 rounded-xl bg-[#0F1120] text-[#F8C927] text-sm font-extrabold"
        >
          Ver todos los oficios
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-[12px] text-gray-500 font-medium mb-3">
        <span className="font-extrabold text-[#0F1120]">{initialResult.total}</span>{" "}
        {initialResult.total !== 1 ? "profesionales" : "profesional"}
        {query ? ` para "${query}"` : ""}
      </p>

      <div className="flex flex-col gap-2.5">
        {items.map((pro, i) => {
          const img = getProImage(pro);
          const [from, to] = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
          const initials = pro.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);
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
              <div className="shrink-0">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={pro.user.name}
                    className="w-[52px] h-[52px] rounded-[14px] object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-white font-black text-sm"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>
                )}
              </div>
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
                  {pro.category.name}
                  {pro.city ? ` · ${pro.city}` : ""}
                  {pro.yearsExperience ? ` · ${pro.yearsExperience} años` : ""}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-[#F8C927] text-[11px]" aria-hidden="true">
                      ★
                    </span>
                    <span className="text-[12px] font-bold text-[#0F1120]">
                      {Number(pro.averageRating).toFixed(1)}
                    </span>
                    <span className="text-[11px] text-gray-400">({pro.totalReviews})</span>
                  </div>
                  {pro.urgencias24hs && (
                    <span className="text-[9px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-100">
                      🚨 24hs
                    </span>
                  )}
                  {pro.conGarantia && (
                    <span className="text-[9px] font-extrabold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">
                      🛡️ Garantía
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

      {/* Infinite scroll sentinel + loading state */}
      {page < totalPages && (
        <div ref={sentinelRef} className="py-6 flex flex-col items-center gap-3">
          {isLoadingMore && (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-[#0F1120] rounded-full animate-spin" />
              <span className="text-[12px] font-medium">Cargando más...</span>
            </div>
          )}
          {error && (
            <button
              type="button"
              onClick={loadMore}
              className="text-[12px] font-extrabold text-[#0F1120] underline"
            >
              Error al cargar. Reintentar
            </button>
          )}
        </div>
      )}

      {page >= totalPages && items.length >= 20 && (
        <div className="py-6 text-center">
          <p className="text-[11px] text-gray-400 font-medium">
            Llegaste al final · {items.length} profesionales
          </p>
        </div>
      )}
    </>
  );
}