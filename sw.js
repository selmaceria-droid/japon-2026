// Garde l'app disponible hors ligne (métro, avion…).
// Changez VERSION à chaque mise à jour pour forcer le rafraîchissement.
const VERSION = 'japon-v26';
const FILES = ['./', 'index.html', 'installer.html', 'selma.html', 'app.js', 'data.js', 'icones-apps.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png',
  // les billets livrés avec l'app (chiffrés), pour les avoir au portique sans réseau
  'billets/2026-10-14-tokyo-acces.jpg.enc',
  'billets/2026-10-14-tokyo-boite-a-cle.jpg.enc',
  'billets/2026-10-14-tokyo-immeuble.jpg.enc',
  'billets/2026-10-14-tokyo-porte.jpg.enc',
  'billets/2026-10-18-fuji-excursion-retrait.jpg.enc',
  'billets/2026-10-20-bus-mishima.jpg.enc',
  'billets/2026-10-20-shinkansen-8A.jpg.enc',
  'billets/2026-10-20-shinkansen-8B.jpg.enc',
  'billets/2026-10-20-shinkansen-8C.jpg.enc',
  'billets/2026-10-20-shinkansen-8D.jpg.enc',
  'billets/2026-10-20-shinkansen-8E.jpg.enc',
  'billets/2026-10-28-usj-entree-1.jpg.enc',
  'billets/2026-10-28-usj-entree-2.jpg.enc',
  'billets/2026-10-28-usj-entree-3.jpg.enc',
  'billets/2026-10-28-usj-express-1.jpg.enc',
  'billets/2026-10-28-usj-express-2.jpg.enc',
  'billets/2026-10-28-usj-express-3.jpg.enc',
  'billets/2026-10-28-usj-repas-1.jpg.enc',
  'billets/2026-10-28-usj-repas-2.jpg.enc',
  'billets/2026-10-28-usj-repas-3.jpg.enc',
  'billets/2026-10-30-nozomi-1B.jpg.enc',
  'billets/2026-10-30-nozomi-1C.jpg.enc',
  'billets/2026-10-30-nozomi-1D.jpg.enc'];

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
  // 'no-cache' = on redemande au serveur avec un « si modifié depuis » : c'est
  // peu coûteux (304 si rien n'a bougé) et ça évite que GitHub Pages serve
  // pendant dix minutes une version périmée après une mise à jour.
  e.respondWith(
    fetch(local ? new Request(req, {cache: 'no-cache'}) : req)
      .then(r => {
        if (local && r.ok) { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)).catch(() => {}); }
        return r;
      })
      .catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
