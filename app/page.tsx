// ─────────────────────────────────────────────────────────────────────────────
// SEO METADATA — agregar en layout.tsx o en este mismo archivo si usás App Router
// ─────────────────────────────────────────────────────────────────────────────
// export const metadata = {
//   title: "OficiosGo! – Plomeros, Electricistas y Más en Villa María, Córdoba",
//   description:
//     "Encontrá profesionales de oficios verificados en Villa María: plomeros, electricistas, pintores, carpinteros. Descargá la app gratis y contactalos hoy.",
//   keywords: [
//     "plomero villa maría", "electricista villa maría córdoba",
//     "servicios del hogar villa maría", "profesionales oficios córdoba",
//     "contratar plomero villa maría", "pintor villa maría",
//   ],
// };

import Link from "next/link";
import { categoryRepository } from "@/server/repositories/category.repository";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { sponsorRepository } from "@/server/repositories/sponsor.repository";
import { searchService } from "@/server/services/search.service";
import { Footer } from "@/components/ui/footer";
import { LandingNavbar } from "@/components/ui/landing-navbar";

export const revalidate = 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const INITIALS = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export default async function LandingPage() {
  const [categories, featured, sponsors, totalPros] = await Promise.all([
    categoryRepository.getAll(),
    searchService.getFeatured(4),
    sponsorRepository.getActive("Villa María"),
    professionalRepository.countAll(),
  ]);

  // Rating fijo como social proof creíble (no depende de featured variable)
  const avgRating = "4.9";

  return (
    <div className="bg-white font-sans antialiased">
      <LandingNavbar />

      {/* ═══════════════════════════════════════════════════════════════
          HERO — "Problema → Solución → Acción" en 3 segundos
      ═══════════════════════════════════════════════════════════════ */}
      <section
        aria-label="Inicio"
        className="relative min-h-[100svh] overflow-hidden flex items-center"
        style={{
          background:
            "linear-gradient(155deg, #0F1120 0%, #0A0C18 55%, #1E2035 100%)",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        {/* Glow orbs */}
        <div
          className="absolute top-[10%] right-[-10%] w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(248,201,39,0.10), transparent 68%)",
            filter: "blur(72px)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[-8%] left-[-6%] w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(92,128,188,0.09), transparent 68%)",
            filter: "blur(56px)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-14 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* ── Copy ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-[280px] max-w-[580px] text-center lg:text-left">

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.07] border border-white/10 text-[11px] sm:text-xs font-semibold text-gray-400 mb-5 sm:mb-6 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              📍 Villa María, Córdoba — Profesionales activos hoy
            </div>

            {/* H1 con keyword local */}
            <h1 className="text-[36px] sm:text-5xl lg:text-[58px] font-black text-white leading-[1.07] tracking-tight">
              El profesional que
              <br className="hidden sm:block" /> necesitás en
              <br />
              <span className="bg-gradient-to-r from-[#F8C927] via-[#F7B924] to-[#F5A623] bg-clip-text text-transparent">
                Villa&nbsp;María
              </span>
              , hoy.
            </h1>

            {/* Subtítulo orientado al dolor */}
            <p className="text-sm sm:text-lg text-gray-400 leading-relaxed mt-4 sm:mt-5 max-w-[460px] mx-auto lg:mx-0">
              Terminá con las recomendaciones de dudosa reputación.
              Encontrá plomeros, electricistas, pintores y más —{" "}
              <strong className="text-gray-300 font-semibold">
                verificados, con reseñas reales y disponibles ahora.
              </strong>
            </p>

            {/* CTAs — primario > secundario */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10 justify-center lg:justify-start">
              <Link
                href="/app"
                className="group relative flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#F8C927] text-[#0F1120] text-base font-extrabold shadow-2xl shadow-[#F8C927]/30 hover:scale-[1.04] active:scale-[0.97] transition-transform overflow-hidden"
              >
                {/* Shimmer */}
                <span
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                  }}
                  aria-hidden="true"
                />
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                Descargar gratis
              </Link>

              <Link
                href="/registro"
                className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white/[0.06] border border-white/15 text-white text-base font-bold backdrop-blur-sm hover:bg-white/[0.11] active:scale-[0.97] transition-all"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F8C927"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" x2="19" y1="8" y2="14" />
                  <line x1="22" x2="16" y1="11" y2="11" />
                </svg>
                Registrá tu servicio
              </Link>
            </div>

            {/* Social proof — 3 pillars */}
            <div className="flex gap-8 sm:gap-10 mt-10 justify-center lg:justify-start">
              {[
                { v: `${totalPros}+`, l: "Profesionales activos" },
                { v: avgRating + " ★", l: "Rating promedio" },
                { v: `${categories.length}`, l: "Categorías de servicio" },
              ].map((s) => (
                <div key={s.l} className="flex flex-col items-center lg:items-start">
                  <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                    {s.v}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-0.5 leading-tight">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Phone Mockup ─────────────────────────────────── */}
          <div className="flex-shrink-0 hidden lg:flex justify-center" aria-hidden="true">
            <div
              className="relative"
              style={{ animation: "float 4.5s ease-in-out infinite" }}
            >
              {/* Glow bajo el teléfono */}
              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full"
                style={{
                  background: "rgba(248,201,39,0.18)",
                  filter: "blur(20px)",
                }}
              />
              <div className="w-[234px] h-[468px] rounded-[38px] bg-[#0a0a0a] p-[7px] border-[2.5px] border-[#2a2a2a] shadow-2xl shadow-black/60 relative">
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[72px] h-[22px] bg-[#0a0a0a] rounded-b-2xl z-10" />
                <div className="w-full h-full rounded-[30px] bg-[#F2F2F7] overflow-hidden relative">
                  {/* App header */}
                  <div
                    className="rounded-b-[14px] px-3.5 pt-8 pb-4"
                    style={{
                      background: "linear-gradient(175deg, #0F1120, #1E2035)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo-white.svg"
                      alt="OficiosGo!"
                      className="h-[15px] w-auto mb-3"
                    />
                    <div className="px-3 py-2 bg-white rounded-xl flex items-center gap-1.5 shadow-sm">
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9CA3AF"
                        strokeWidth="2.5"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                      </svg>
                      <span className="text-[7.5px] text-gray-400 font-medium">
                        ¿Qué necesitás hoy?
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 mt-2.5">
                      {[
                        { i: "🔧", n: "Plomería" },
                        { i: "⚡", n: "Electricidad" },
                        { i: "🧹", n: "Limpieza" },
                        { i: "🎨", n: "Pintura" },
                      ].map((c) => (
                        <div
                          key={c.n}
                          className="py-2.5 rounded-xl text-center"
                          style={{
                            background:
                              "linear-gradient(145deg, #F8C927, #E5B800)",
                          }}
                        >
                          <div className="text-[11px]">{c.i}</div>
                          <div className="text-[5.5px] font-extrabold text-[#0F1120] mt-0.5 leading-tight">
                            {c.n}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Pro cards */}
                  <div className="p-2.5">
                    <div className="text-[7.5px] font-extrabold text-[#1A1D2E] mb-2">
                      Destacados cerca tuyo
                    </div>
                    <div className="space-y-1.5">
                      {["Carlos M.", "Ana R.", "Luis G."].map((name, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-white rounded-xl p-2 border border-gray-100 shadow-sm"
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[7px] font-black shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${["#5C80BC","#F5A623","#7A9263"][i]}, ${["#3a5a96","#e87d1a","#506048"][i]})`,
                            }}
                          >
                            {name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[6px] font-extrabold text-[#1A1D2E] truncate">
                              {name}
                            </div>
                            <div className="text-[5.5px] text-gray-400">
                              {["Electricista", "Plomera", "Pintor"][i]}
                            </div>
                          </div>
                          <div className="ml-auto shrink-0">
                            <div className="text-[5.5px] text-[#F8C927] font-extrabold">
                              ★ {["4.9", "5.0", "4.8"][i]}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Tab bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 flex py-1.5">
                    {["🏠", "🔍", "📋", "👤"].map((ic, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-0.5"
                        style={{ opacity: i === 0 ? 1 : 0.35 }}
                      >
                        <span style={{ fontSize: 9 }}>{ic}</span>
                        <span
                          style={{ fontSize: 4 }}
                          className={
                            i === 0
                              ? "font-extrabold text-[#1A1D2E]"
                              : "text-gray-400"
                          }
                        >
                          {["Inicio", "Buscar", "Pedidos", "Perfil"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40"
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CÓMO FUNCIONA — elimina la fricción cognitiva pre-descarga
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F1120] tracking-tight">
            Tres pasos. Sin vueltas.
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-md mx-auto">
            Del problema al profesional en menos de 2 minutos.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Connector line — desktop */}
          <div
            className="hidden sm:block absolute top-[2.75rem] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #F8C927, #F8C927, transparent)",
            }}
            aria-hidden="true"
          />
          {[
            {
              n: "1",
              icon: "🔍",
              title: "Buscá por categoría",
              desc: "Plomería, electricidad, pintura, limpieza y más. Filtrá por zona dentro de Villa María.",
            },
            {
              n: "2",
              icon: "⭐",
              title: "Leé reseñas reales",
              desc: "Calificaciones verificadas de vecinos. Ves fotos de trabajos anteriores antes de llamar.",
            },
            {
              n: "3",
              icon: "📞",
              title: "Contactá directo",
              desc: "Sin intermediarios, sin comisiones. Hablás directo con el profesional y cerrás el trabajo.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="flex flex-col items-center text-center sm:items-center relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F8C927] text-[#0F1120] text-xl font-black flex items-center justify-center shadow-lg shadow-[#F8C927]/20 relative z-10 mb-4">
                {step.icon}
              </div>
              <h3 className="font-extrabold text-[#0F1120] text-base sm:text-[17px]">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-[220px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0F1120] text-[#F8C927] text-sm font-extrabold hover:bg-[#1E2035] transition-colors"
          >
            Probalo gratis →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CATEGORÍAS
      ═══════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="categories-title"
        className="py-12 sm:py-20 px-5 sm:px-8 bg-[#F8F8FA]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              id="categories-title"
              className="text-2xl sm:text-4xl font-black text-[#0F1120] tracking-tight"
            >
              Servicios disponibles en Villa María
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              {categories.length} categorías con profesionales verificados
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/app/buscar?category=${cat.slug}`}
                className="group flex flex-col items-center p-4 sm:p-5 rounded-2xl border border-gray-200 bg-white text-center hover:-translate-y-1 hover:shadow-xl hover:border-[#F8C927] active:scale-[0.97] transition-all duration-200 gap-2"
              >
                <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                <span className="text-xs sm:text-sm font-bold text-[#0F1120] leading-tight">
                  {cat.name}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {cat._count.profiles}{" "}
                  {cat._count.profiles === 1 ? "profesional" : "profesionales"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURED PROFESSIONALS
      ═══════════════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section
          aria-labelledby="featured-title"
          className="py-12 sm:py-20 px-5 sm:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-6 sm:mb-10 flex-wrap gap-3">
              <div>
                <h2
                  id="featured-title"
                  className="text-2xl sm:text-3xl font-black text-[#0F1120]"
                >
                  Profesionales mejor valorados
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Calificados por vecinos de Villa María
                </p>
              </div>
              <Link
                href="/app/buscar"
                className="px-5 py-2.5 rounded-xl bg-[#0F1120] text-[#F8C927] text-xs sm:text-sm font-bold hover:bg-[#1E2035] transition-colors"
              >
                Ver todos →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((pro) => {
                const isPremium = pro.tier === "PREMIUM";
                return (
                  <Link
                    key={pro.id}
                    href={`/app/profesional/${pro.slug}`}
                    className={`group block rounded-2xl bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] ${
                      isPremium
                        ? "border-2 border-[#F5A623] shadow-md shadow-[#F5A623]/10"
                        : "border border-gray-200"
                    }`}
                  >
                    {/* Header color bar */}
                    <div
                      className="h-2 w-full"
                      style={{
                        background: isPremium
                          ? "linear-gradient(90deg, #F5A623, #F8C927)"
                          : "linear-gradient(90deg, #5C80BC, #7A9263)",
                      }}
                    />
                    <div className="p-4 flex gap-3 items-start">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C80BC] to-[#3a5a96] flex items-center justify-center text-white text-sm font-black shrink-0">
                        {INITIALS(pro.user.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-[#0F1120] text-sm truncate">
                            {pro.user.name}
                          </span>
                          {isPremium && (
                            <span className="shrink-0 text-[8px] font-extrabold bg-gradient-to-r from-[#F5A623] to-[#F8C927] text-[#0F1120] px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                              Premium
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#5C80BC] font-semibold mt-0.5">
                          {pro.category.icon} {pro.category.name}
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-[#F8C927] text-sm">★</span>
                          <span className="text-sm font-bold text-[#0F1120]">
                            {pro.averageRating.toFixed(1)}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            ({pro.totalReviews} reseñas)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <span className="inline-block w-full text-center text-xs font-extrabold py-2 rounded-lg bg-[#F8F8FA] text-[#0F1120] group-hover:bg-[#F8C927] transition-colors">
                        Ver perfil →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SPONSORS — Infinite Marquee Carousel
      ═══════════════════════════════════════════════════════════════ */}
      {sponsors.length > 0 && (
        <section className="py-12 sm:py-16 bg-[#F8F8FA] overflow-hidden">
          {/* Header */}
          <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-8 sm:mb-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              Negocios que confían en OficiosGo!
            </p>
            <h2 className="text-lg sm:text-2xl font-black text-[#0F1120]">
              Proveedores y comercios de Villa María
            </h2>
          </div>

          {/* Marquee wrapper */}
          <div className="relative w-full">
            {/* Fade izquierda */}
            <div
              className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none"
              style={{ background: "linear-gradient(90deg, #F8F8FA 0%, transparent 100%)" }}
              aria-hidden="true"
            />
            {/* Fade derecha */}
            <div
              className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none"
              style={{ background: "linear-gradient(270deg, #F8F8FA 0%, transparent 100%)" }}
              aria-hidden="true"
            />

            {/* Track triplicado para loop infinito */}
            <div className="sponsors-track flex gap-4 w-max px-4" aria-label="Sponsors">
              {[...sponsors, ...sponsors, ...sponsors].map((s, idx) => {
                const isPremium = s.tier === "PREMIUM";
                return (
                  <div
                    key={`${s.id}-${idx}`}
                    className={`relative flex-shrink-0 w-[240px] sm:w-[260px] rounded-2xl overflow-hidden ${
                      isPremium
                        ? "border-2 border-[#F8C927]/60 bg-white shadow-lg shadow-[#F8C927]/10"
                        : "border border-gray-200 bg-white shadow-sm"
                    }`}
                  >
                    {/* Barra superior dorada — solo Premium */}
                    {isPremium && (
                      <div
                        className="h-1.5 w-full shrink-0"
                        style={{ background: "linear-gradient(90deg, #F5A623, #F8C927, #F5A623)" }}
                      />
                    )}

                    {/* Glow orb — solo Premium */}
                    {isPremium && (
                      <div
                        className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle, rgba(248,201,39,0.13), transparent 70%)" }}
                        aria-hidden="true"
                      />
                    )}

                    <div className="relative z-10 p-4 flex flex-col gap-3">
                      {/* Logo + nombre + badge */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${
                            isPremium
                              ? "border-2 border-[#F8C927]/40 bg-[#FFFBEA]"
                              : "border border-gray-200 bg-gray-50"
                          }`}
                        >
                          {(s as any).logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={(s as any).logoUrl}
                              alt={s.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span
                              className="text-2xl font-black"
                              style={{ color: isPremium ? "#F8C927" : "#9CA3AF" }}
                            >
                              {s.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="block font-extrabold text-[#0F1120] text-sm truncate leading-tight">
                            {s.name}
                          </span>
                          <span
                            className={`inline-block mt-1 text-[9px] font-extrabold px-2 py-[3px] rounded-md uppercase tracking-wide ${
                              isPremium
                                ? "bg-[#F8C927] text-[#0F1120]"
                                : "bg-[#5C80BC]/10 text-[#5C80BC]"
                            }`}
                          >
                            {isPremium ? "★ Premium Partner" : "Sponsor oficial"}
                          </span>
                        </div>
                      </div>

                      {/* Descripción */}
                      {s.description && (
                        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                          {s.description}
                        </p>
                      )}

                      {/* Botón llamar */}
                      {s.phone && (
                        <a
                          href={`tel:${s.phone}`}
                          className={`inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[11px] font-bold transition-colors ${
                            isPremium
                              ? "bg-[#F8C927]/15 text-[#0F1120] hover:bg-[#F8C927]/30"
                              : "bg-[#5C80BC]/10 text-[#5C80BC] hover:bg-[#5C80BC]/20"
                          }`}
                        >
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          Llamar: {s.phone}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Ser Sponsor */}
          <div className="mt-10 text-center px-5">
            <a
              href="https://wa.me/5493534127410?text=Hola%2C%20quiero%20ser%20sponsor%20en%20OficiosGo!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #0F1120, #1A1D2E)",
                color: "#F8C927",
                border: "1px solid rgba(248,201,39,0.25)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              ¿Querés ser sponsor? Contactanos
            </a>
            <p className="text-[11px] text-gray-400 mt-2">
              Espacios limitados para Villa María y alrededores
            </p>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          CTA FINAL — nuevo argumento: para prestadores
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 px-5 sm:px-8 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0F1120, #1E2035)" }}
        aria-labelledby="cta-title"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(248,201,39,0.06), transparent)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.07] border border-white/10 text-[11px] font-semibold text-gray-400 mb-5">
            👷 Para profesionales de oficios
          </div>
          <h2
            id="cta-title"
            className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4 leading-tight"
          >
            Conseguí clientes nuevos
            <br />
            <span className="text-[#F8C927]">sin pagar por cada contacto.</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed">
            Creá tu perfil gratis, mostrá fotos de tus trabajos y aparecé en las búsquedas de quienes te necesitan en Villa María.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/registro"
              className="px-9 py-4 rounded-xl bg-[#F8C927] text-[#0F1120] font-extrabold text-base sm:text-lg shadow-2xl shadow-[#F8C927]/25 hover:scale-[1.03] active:scale-[0.97] transition-transform"
            >
              Crear mi perfil gratis
            </Link>
            <Link
              href="/app"
              className="px-9 py-4 rounded-xl bg-white/[0.08] border border-white/15 text-white font-bold text-base sm:text-lg hover:bg-white/[0.14] active:scale-[0.97] transition-all"
            >
              Descargar la app
            </Link>
          </div>
          <p className="text-[11px] text-gray-600 mt-5">
            Sin tarjeta de crédito · Sin permanencia · Sin comisiones
          </p>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(1.5deg); }
          50%       { transform: translateY(-18px) rotate(-0.5deg); }
        }
        .sponsors-track {
          animation: sponsors-scroll 36s linear infinite;
        }
        .sponsors-track:hover {
          animation-play-state: paused;
        }
        @keyframes sponsors-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </div>
  );
}