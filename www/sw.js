// تسلّى غو — offline cache. Bump VERSION whenever any file changes so phones pick up the update.
const VERSION = "tasalla-go-v2.2.0";
const FILES = [
  "./",
  "./index.html",
  "./group.html",
  "./couples.html",
  "./manifest.json",
  "./css/couples.css",
  "./css/fonts.css",
  "./css/group.css",
  "./css/index.css",
  "./css/shared.css",
  "./js/couples-content.js",
  "./js/couples.js",
  "./js/group-content.js",
  "./js/group.js",
  "./js/icons.js",
  "./js/index.js",
  "./js/sw-register.js",
  "./js/app-native.js",
  "./fonts/alexandria-arabic-600-normal.woff2",
  "./fonts/alexandria-arabic-700-normal.woff2",
  "./fonts/alexandria-arabic-800-normal.woff2",
  "./fonts/alexandria-latin-600-normal.woff2",
  "./fonts/alexandria-latin-700-normal.woff2",
  "./fonts/alexandria-latin-800-normal.woff2",
  "./fonts/readex-pro-arabic-400-normal.woff2",
  "./fonts/readex-pro-arabic-500-normal.woff2",
  "./fonts/readex-pro-arabic-600-normal.woff2",
  "./fonts/readex-pro-latin-400-normal.woff2",
  "./fonts/readex-pro-latin-500-normal.woff2",
  "./fonts/readex-pro-latin-600-normal.woff2",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon.svg",
  "./icons/maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Pages: network first (so updates arrive), cache as fallback. Everything else: cache first.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }
  e.respondWith(caches.match(req).then((r) => r || fetch(req)));
});
