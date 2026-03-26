"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <nav
      aria-label="Navegación principal"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0F1120]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">

        {/* Logo */}
        <Link href="/" aria-label="OficiosGo! — Inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-white.svg"
            alt="OficiosGo!"
            className="h-9 sm:h-12 w-auto"
          />
        </Link>

        {/* CTAs — jerarquía: ghost > outlined > filled */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Menor prioridad — solo desktop */}
          <Link
            href="/login"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg text-white/60 text-sm font-medium hover:text-white transition-colors"
          >
            Ingresar
          </Link>

          {/* Media prioridad */}
          <Link
            href="/app"
            className="px-3 sm:px-5 py-2 rounded-lg bg-white/8 border border-white/12 text-white text-xs sm:text-sm font-semibold hover:bg-white/15 transition-all"
          >
            Explorar
          </Link>

          {/* CTA primario — máxima atención */}
          <Link
            href="/registro"
            className="px-3 sm:px-5 py-2 rounded-lg bg-[#F8C927] text-[#0F1120] text-xs sm:text-sm font-extrabold shadow-[0_0_16px_rgba(248,201,39,0.35)] hover:brightness-105 active:scale-[0.97] transition-all"
          >
            <span className="hidden sm:inline">Publicá tu servicio</span>
            <span className="sm:hidden">Registrate</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}