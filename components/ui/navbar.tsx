"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/buscar", label: "Buscar" },
    { href: "/dashboard", label: "Mi Panel" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-200" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-[10px] bg-brand-yellow flex items-center justify-center text-sm font-black text-brand-black shadow-sm">
              Go
            </div>
            <span className="text-xl font-black text-brand-black tracking-tight">
              Oficios<span className="text-brand-gold">Go!</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === l.href
                    ? "bg-yellow-50 text-brand-black"
                    : "text-gray-600 hover:text-brand-black hover:bg-gray-50"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg bg-brand-black text-brand-yellow text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Ingresar
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-brand-black"
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-16 inset-x-0 bottom-0 bg-white z-40 p-6 flex flex-col gap-2 md:hidden animate-in slide-in-from-top">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-5 py-4 rounded-xl text-base font-semibold bg-gray-50 text-brand-black"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="px-5 py-4 rounded-xl text-base font-bold bg-brand-black text-brand-yellow text-center mt-2"
          >
            Ingresar
          </Link>
        </div>
      )}
    </>
  );
}
