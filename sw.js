// Garde l'app disponible hors ligne (métro, avion…).
// Changez VERSION à chaque mise à jour pour forcer le rafraîchissement.
const VERSION = 'japon-v15';
const FILES = ['./', 'index.html', 'installer.html', 'selma.html', 'app.js', 'data.js', 'icones-apps.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => e.waitUntil(
  caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
));

self.addEventListener('activate', e => e.waitUntil(
  caches.keys()
    .then(k => Promise.all(k.filter(x => x !== VERSION).map(x => caches.delete(x))))
    .then(() => self.clients.claim())
));

// Réseau d'abord (pour avoir les dernières données), cache en secours.
// On ne met en cache que nos propres fichiers : une réponse d'un autre
// domaine (les polices Google) ne peut pas être stockée.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const local = new URL(req.url).origin === self.location.origin;
  e.respondWith(
    fetch(req)
      .then(r => {
        if (local && r.ok) { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)).catch(() => {}); }
        return r;
      })
      .catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
