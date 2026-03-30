"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Logo } from "@/components/ui/logo";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Bloquea scroll del body cuando el menú mobile está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra menú al cambiar de ruta
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/buscar", label: "Buscar oficio" },   // más descriptivo para SEO
    { href: "/como-funciona", label: "Cómo funciona" }, // reduce fricción/duda
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav
        role="navigation"
        aria-label="Navegación principal"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" aria-label="OficiosGo! — Inicio" className="flex items-center shrink-0">
            <Logo variant="dark" height={40} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(l.href)
                    ? "bg-amber-50 text-[#0d0e14]"
                    : "text-gray-500 hover:text-[#0d0e14] hover:bg-gray-50"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="w-px h-5 bg-gray-200 mx-2" aria-hidden="true" />

            {/* CTA secundario — baja fricción */}
            <Link
              href="/registro"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-[#0d0e14] hover:bg-gray-50 transition-colors"
            >
              Publicá tu oficio
            </Link>

            {/* CTA principal */}
            <Link
              href="/buscar"
              className="ml-1 px-5 py-2 rounded-lg bg-[#F5A623] text-[#0d0e14] text-sm font-bold hover:bg-[#e09612] transition-colors shadow-sm"
            >
              Encontrá un profesional
            </Link>
          </div>

          {/* Mobile: CTA rápido visible + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/buscar"
              className="px-3.5 py-2 rounded-lg bg-[#F5A623] text-[#0d0e14] text-sm font-bold hover:bg-[#e09612] transition-colors"
            >
              Buscar
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-[#0d0e14] rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </>
                ) : (
                  <>
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu — overlay completo */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed inset-0 top-16 bg-white z-40 flex flex-col md:hidden transition-all duration-200 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1.5 p-4 flex-1 overflow-y-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`flex items-center px-5 py-4 rounded-xl text-base font-semibold transition-colors ${
                isActive(l.href)
                  ? "bg-amber-50 text-[#0d0e14]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {l.label}
              {isActive(l.href) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F5A623]" aria-hidden="true" />
              )}
            </Link>
          ))}

          {/* Divisor */}
          <div className="h-px bg-gray-100 my-2" aria-hidden="true" />

          <Link
            href="/login"
            className="flex items-center justify-center px-5 py-4 rounded-xl text-base font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Ingresar a mi cuenta
          </Link>

          {/* CTA principal mobile — full width, alto impacto */}
          <Link
            href="/buscar"
            className="flex items-center justify-center px-5 py-4 rounded-xl text-base font-bold bg-[#F5A623] text-[#0d0e14] hover:bg-[#e09612] transition-colors mt-1 shadow-sm"
          >
            Encontrá un profesional →
          </Link>

          {/* Trust signal mobile */}
          <p className="text-center text-xs text-gray-400 mt-3 pb-6">
            Profesionales verificados en Villa María y Villa Nueva, Córdoba
          </p>
        </div>
      </div>

      {/* Overlay oscuro detrás del menú */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/20 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}