/* ELEMEN – service worker: hra funguje aj offline.
   Pri vydaní novej verzie hry zvýš číslo CACHE (elemen-v12, v13, …),
   aby si zariadenia stiahli čerstvé súbory. */
const CACHE = 'elemen-v12';
const SUBORY = [
  '.',
  'index.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SUBORY)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((mena) =>
      Promise.all(mena.filter((m) => m !== CACHE).map((m) => caches.delete(m)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // otvorenie hry: najprv sieť (vždy najnovšia verzia), pri výpadku cache
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((odpoved) => {
          const kopia = odpoved.clone();
          caches.open(CACHE).then((c) => c.put(e.request, kopia));
          return odpoved;
        })
        .catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
    );
    return;
  }

  // ostatné súbory: cache hneď, na pozadí obnov zo siete
  e.respondWith(
    caches.match(e.request).then((zCache) => {
      const zoSiete = fetch(e.request)
        .then((odpoved) => {
          if (odpoved && odpoved.ok) {
            const kopia = odpoved.clone();
            caches.open(CACHE).then((c) => c.put(e.request, kopia));
          }
          return odpoved;
        })
        .catch(() => zCache);
      return zCache || zoSiete;
    })
  );
});
