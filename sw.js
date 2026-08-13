/* Eventlas Service Worker — macht die Karte offline-fähig und installierbar.
   Strategie bewusst network-first für eigene Dateien: Nach einem Netlify-Upload sollen
   Nutzer die neue Version sofort sehen, nicht erst nach Cache-Ablauf. Der Cache ist nur
   das Sicherheitsnetz für "kein Netz" (U-Bahn, Funkloch auf dem Wochenmarkt).
   Karten-Kacheln werden NICHT gecacht — das wären tausende Dateien. */
const CACHE = "eventlas-v3";

// App-Shell: das Minimum, mit dem die Karte startet
const SHELL = [
  "./",
  "./index.html",
  "./pins.json",
  "./orte.json",
  "./icon-192.png",
  "./icon-512.png",
  "./schriften/anton.woff2",
  "./schriften/inter.woff2",
  "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js",
  "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css",
];

self.addEventListener("install", e => {
  // addAll bricht komplett ab, wenn eine einzelne Datei fehlschlägt — deshalb einzeln.
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(namen => Promise.all(namen.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Karten-Kacheln und Tile-Metadaten: immer direkt aus dem Netz, nie cachen.
  if (/tiles\.openfreemap\.org|openmaptiles|\.pbf($|\?)/.test(url.href)) return;

  // Bibliotheken: cache-first (versionierte URLs, ändern sich nie).
  // Schriften liegen lokal und laufen über den Origin-Zweig weiter unten.
  if (/unpkg\.com/.test(url.hostname)) {
    e.respondWith(
      caches.match(req).then(treffer => treffer || fetch(req).then(res => {
        const kopie = res.clone();
        caches.open(CACHE).then(c => c.put(req, kopie)).catch(() => {});
        return res;
      }).catch(() => treffer))
    );
    return;
  }

  // Eigene Dateien (index.html, pins.json, Icons): network-first, Cache als Fallback.
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) {
            const kopie = res.clone();
            // Cache-Buster-Query (?v=…) wegwerfen, sonst wächst der Cache endlos
            const key = url.pathname + (url.pathname.endsWith("/") ? "index.html" : "");
            caches.open(CACHE).then(c => c.put(key, kopie)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(url.pathname).then(t => t || caches.match("./index.html")))
    );
  }
});
