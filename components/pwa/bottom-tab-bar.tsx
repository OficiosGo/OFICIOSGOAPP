"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/app",
    match: (p: string) => p === "/app",
    label: "Inicio",
    icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth={a ? "0" : "1.8"}><path d="M12 2.1L1 12h3v9h7v-6h2v6h7v-9h3L12 2.1z"/></svg>,
  },
  {
    href: "/app/buscar",
    match: (p: string) => p.startsWith("/app/buscar"),
    label: "Servicios",
    icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? "2.5" : "1.8"} strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  },
  {
    href: "/app/pedidos",
    match: (p: string) => p.startsWith("/app/pedidos"),
    label: "Mis Pedidos",
    icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? "2.5" : "1.8"} strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>,
  },
  {
    href: "/app/cuenta",
    match: (p: string) => p.startsWith("/app/cuenta") || p.startsWith("/app/dashboard"),
    label: "Cuenta",
    icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? "2.5" : "1.8"} strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>,
  },
];

export function BottomTabBar() {
  const pathname = usePathname();

  // Hide on certain pages
  if (pathname.startsWith("/app/profesional/") || pathname.startsWith("/login") || pathname.startsWith("/registro") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200" style={{ paddingBottom: "env(safe-area-inset-bottom, 6px)" }}>
      <div className="max-w-[430px] mx-auto flex">
        {tabs.map((t) => {
          const active = t.match(pathname);
          return (
            <Link key={t.href} href={t.href} className="flex-1 flex flex-col items-center gap-0.5 py-2.5 relative">
              <span className={active ? "text-[#F8C927]" : "text-gray-400"}>
                {t.icon(active)}
              </span>
              {active && <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F8C927]" />}
              <span className={`text-[10px] ${active ? "font-bold text-[#1A1D2E]" : "font-medium text-gray-400"}`}>
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
