const CACHE_NAME = 'lenscraft-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/client-login.html',
  '/client-styles.css',
  '/client-script.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  
  // Bypass caching for script.js to always get latest version
  if (request.url.includes('script.js')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Bypass external (cross-origin) requests entirely so they don't fall back to home
  try {
    const requestUrl = new URL(request.url);
    if (requestUrl.origin !== self.location.origin) {
      return; // Let the browser handle cross-origin normally
    }
  } catch {}
  
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    }).catch(() => caches.match('/index.html')))
  );
});


