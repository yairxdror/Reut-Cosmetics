const CACHE_NAME = "reut-cosmetics-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Only page navigations are intercepted. A standalone/home-screen app can't
// be relied on to check the network for a fresh copy on its own — this
// forces it to. Everything else (JS/CSS/images/API calls) passes straight
// through untouched; Next.js content-hashes its own assets already, so
// there's no separate cache to keep in sync with a new deploy.
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
