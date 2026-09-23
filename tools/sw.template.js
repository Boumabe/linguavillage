// LinguaVillage — service worker (généré par tools/make_sw.py — ne pas éditer sw.js à la main)
// Stratégies :
//  • pages, scripts, styles : réseau d'abord (les mises à jour arrivent tout de suite), cache en secours hors-ligne
//  • modèles 3D, icônes, polices : cache d'abord + rafraîchissement en arrière-plan (léger, rapide)
//  • /api/* : jamais mis en cache
const VERSION = 'lv-__VERSION__';
const PRECACHE = [
  __PRECACHE__
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    // allSettled : un fichier manquant ne bloque pas l'installation
    await Promise.allSettled(PRECACHE.map((u) => cache.add(new Request(u, { cache: 'reload' }))));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('lv-') && k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)); }

async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  try {
    const res = await Promise.race([fetch(req), timeout(4000)]);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') { const shell = await cache.match('./'); if (shell) return shell; }
    throw err;
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req);
  const refresh = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => null);
  return hit || (await refresh) || Response.error();
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.pathname.startsWith('/api/')) return;                       // IA : toujours le réseau
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') { e.respondWith(staleWhileRevalidate(req)); return; }
  if (url.origin !== self.location.origin) return;
  if (/\/(assets\/models|icons)\//.test(url.pathname)) { e.respondWith(staleWhileRevalidate(req)); return; }
  e.respondWith(networkFirst(req));
});
