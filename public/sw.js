const CACHE_VERSION = "v6";
const CACHE_NAME = `oficiosgo-${CACHE_VERSION}`;

const PRECACHE = [
  "/manifest.json",
  "/logo-white.svg",
  "/logo-dark.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Allow client to trigger skipWaiting via message
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (!request.url.startsWith("http")) return;

  // NEVER cache Next.js chunks, HTML pages, or API calls
  // These must always be fresh to avoid version mismatch
  const isNextChunk = url.pathname.startsWith("/_next/");
  const isHTML = request.mode === "navigate" || request.headers.get("accept")?.includes("text/html");
  const isAPI = url.pathname.startsWith("/api/");

  if (isNextChunk || isHTML || isAPI) {
    // Network-only with cache fallback ONLY if offline
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Static assets (images, fonts, manifest): cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});