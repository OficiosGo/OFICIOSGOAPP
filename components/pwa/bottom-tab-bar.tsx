"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition, useCallback, useEffect } from "react";

const tabs = [
  {
    href: "/app",
    match: (p: string) => p === "/app",
    label: "Inicio",
    icon: (a: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={a ? "#F8C927" : "none"} stroke={a ? "#F8C927" : "#9CA3AF"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
      </svg>
    ),
  },
  {
    href: "/app/buscar",
    match: (p: string) => p === "/app/buscar" || p.startsWith("/app/buscar/") || p.startsWith("/app/buscar?"),
    label: "Servicios",
    icon: (a: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#F8C927" : "#9CA3AF"} strokeWidth={a ? "2.2" : "1.8"} strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    href: "/app/pedidos",
    match: (p: string) => p === "/app/pedidos" || p.startsWith("/app/pedidos/"),
    label: "Pedidos",
    icon: (a: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#F8C927" : "#9CA3AF"} strokeWidth={a ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/app/cuenta",
    match: (p: string) => p === "/app/cuenta" || p.startsWith("/app/cuenta/"),
    label: "Cuenta",
    icon: (a: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#F8C927" : "#9CA3AF"} strokeWidth={a ? "2.2" : "1.8"} strokeLinecap="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
      </svg>
    ),
  },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // ✅ All hooks declared BEFORE any early return
  const handleNavigate = useCallback(
    (href: string, e: React.MouseEvent) => {
      e.preventDefault();
      if (pathname === href) return;
      setPendingHref(href);
      startTransition(() => {
        router.push(href);
      });
    },
    [pathname, router]
  );

  const handlePrefetch = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router]
  );

  // Clear pending when navigation completes
  useEffect(() => {
    if (!isPending && pendingHref) {
      setPendingHref(null);
    }
  }, [isPending, pendingHref]);

  // ✅ Early returns AFTER hooks
  if (!pathname) return null;
  if (pathname.startsWith("/app/profesional/")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-[430px] mx-auto flex">
          {tabs.map((t) => {
            const isCurrentRoute = t.match(pathname);
            const isPendingThis = pendingHref === t.href && isPending;
            const active = isPendingThis || (isCurrentRoute && !pendingHref);

            return (
              <Link
                key={t.href}
                href={t.href}
                prefetch={false}
                onClick={(e) => handleNavigate(t.href, e)}
                onMouseEnter={() => handlePrefetch(t.href)}
                onTouchStart={() => handlePrefetch(t.href)}
                className={`flex-1 flex flex-col items-center pt-2 pb-1.5 relative active:scale-95 transition-transform ${
                  active ? "" : "opacity-60"
                }`}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-[#F8C927]" />
                )}
                <span className="transition-transform">{t.icon(active)}</span>
                <span className={`text-[10px] mt-0.5 ${active ? "font-extrabold text-[#1A1D2E]" : "font-medium text-gray-400"}`}>
                  {t.label}
                </span>
                {isPendingThis && (
                  <span className="absolute top-1.5 right-1/2 translate-x-[14px] w-1.5 h-1.5 rounded-full bg-[#F8C927] animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}