"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string>("");

  useEffect(() => {
    // Avoid double-tracking the same path
    if (lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;

    // Defer analytics until after the browser is idle — never block navigation
    const send = () => {
      try {
        const payload = JSON.stringify({
          page: pathname,
          referrer: document.referrer || null,
        });

        // sendBeacon is fire-and-forget by design — never blocks
        // and survives page unload
        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: "application/json" });
          navigator.sendBeacon("/api/analytics", blob);
          return;
        }

        // Fallback: fetch with keepalive (also non-blocking)
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      } catch {}
    };

    // Wait until browser is idle to fire — zero impact on perceived perf
    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(send, { timeout: 2000 });
      return () => (window as any).cancelIdleCallback?.(id);
    } else {
      const id = setTimeout(send, 500);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  return null;
}