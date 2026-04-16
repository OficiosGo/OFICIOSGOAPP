"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        registration = reg;

        // When a new SW is found and installed, activate it immediately
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            // New SW is active and there was a previous one → reload
            if (
              newWorker.state === "activated" &&
              navigator.serviceWorker.controller
            ) {
              window.location.reload();
            }
          });
        });
      })
      .catch(() => {});

    // Check for SW updates every 60 seconds
    // This is what fixes the "admin needs Ctrl+R" problem:
    // after a deploy, within 60s the SW detects the new version
    const interval = setInterval(() => {
      registration?.update().catch(() => {});
    }, 60_000);

    // Also check on page visibility (user switches back to app)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        registration?.update().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}