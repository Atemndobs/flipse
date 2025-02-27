const cacheName = 'flipse-cache-v1';
const staticAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/manifest.json',
  '/assets/favicon-32x32.png',
  '/assets/favicon-16x16.png',
  '/assets/apple-icon.png',
  '/assets/android-icon-36x36.png',
  '/assets/android-icon-48x48.png',
  '/assets/android-icon-72x72.png',
  '/assets/android-icon-96x96.png'
];

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(staticAssets);
    })
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cachedResponse = await caches.match(req);
    return cachedResponse;
  }
}
