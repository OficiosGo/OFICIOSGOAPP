const CACHE_VERSION = "v9";
const CACHE_NAME = `oficiosgo-${CACHE_VERSION}`;

const PRECACHE = [
  "/manifest.json",
  "/logo-white.svg",
  "/logo-dark.svg",
];

/* ── Install ─────────────────────────────────────────────────── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  // Activate immediately — don't wait for old tabs to close
  self.skipWaiting();
});

/* ── Activate ────────────────────────────────────────────────── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

/* ── Messages ────────────────────────────────────────────────── */
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/* ── Fetch Strategy ──────────────────────────────────────────── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests over HTTP
  if (request.method !== "GET") return;
  if (!url.protocol.startsWith("http")) return;

  const isAPI = url.pathname.startsWith("/api/");
  const isNextData = url.pathname.startsWith("/_next/data/");
  const isNextChunk = url.pathname.startsWith("/_next/");
  const isHTML =
    request.mode === "navigate" ||
    request.headers.get("accept")?.includes("text/html");

  // ── 1) API + Next.js data routes: NETWORK ONLY (never cache) ──
  if (isAPI || isNextData) {
    event.respondWith(fetch(request));
    return;
  }

  // ── 2) HTML pages: NETWORK FIRST, offline fallback ────────────
  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache a copy for offline fallback
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // ── 3) Next.js chunks (JS/CSS bundles): NETWORK FIRST ────────
  //    These are content-hashed, so a new deploy = new URLs.
  //    Network-first ensures no stale JS after deploy.
  if (isNextChunk) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // ── 4) Static assets (images, fonts, icons): STALE-WHILE-REVALIDATE
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);

      // Return cached immediately, update in background
      return cached || networkFetch;
    })
  );
});