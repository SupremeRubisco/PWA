self.addEventListener('install', (e) => {
  e.waitUntil(
      caches.open('my-cache').then((cache) => {
          return cache.addAll([
              '/',
              '/index.html',
              '/app.js',
              '/manifest.json',
          ]);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request).then((response) => {
          return response || fetch(event.request);
      })
  );
});