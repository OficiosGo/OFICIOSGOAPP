"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1A1D2E]/95 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-[#1A1D2E]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="OficiosGo!" className="h-8 sm:h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link href="/login" className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white/70 text-xs sm:text-sm font-semibold hover:text-white transition-colors">
            Ingresar
          </Link>
          <Link href="/app" className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-bold hover:bg-white/20 transition-all">
            Ver App
          </Link>
          <Link href="/registro" className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-[#F8C927] text-[#1A1D2E] text-xs sm:text-sm font-extrabold shadow-lg shadow-[#F8C927]/30 hover:scale-[1.03] transition-transform">
            Registrate
          </Link>
        </div>
      </div>
    </nav>
  );
}