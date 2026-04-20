const CACHE = 'gymtracker-v2';
const CORE = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('cdn.jsdelivr.net')) {
    e.respondWith(caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      if (cached) return cached;
      try {
        const res = await fetch(e.request);
        cache.put(e.request, res.clone());
        return res;
      } catch { return cached; }
    }));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    }))
  );
});
