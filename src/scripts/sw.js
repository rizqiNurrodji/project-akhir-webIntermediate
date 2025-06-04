import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import CONFIG from '../scripts/config.js';

const manifest = self.__WB_MANIFEST || [];
precacheAndRoute(manifest);

// Cache halaman offline dan fallback API saat install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-pages').then((cache) =>
      cache.addAll([
        '/index.html',
        '/manifest.json',
        '/offline.json', // fallback API response
      ])
    )
  );
});

// Cache style, script, dan worker pakai StaleWhileRevalidate
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'assets-static',
    plugins: [
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 7 * 24 * 60 * 60 }), // 7 hari
    ],
  })
);

// Cache gambar pakai CacheFirst
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'cached-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// NetworkFirst dengan fallback manual untuk API umum
const apiNetworkFirst = new NetworkFirst({
  cacheName: 'api-cache',
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 24 * 60 * 60 }),
  ],
});
registerRoute(
  ({ url }) => url.origin === new URL(CONFIG.BASE_URL).origin && url.pathname.startsWith('/v1'),
  async ({ request }) => {
    try {
      const response = await apiNetworkFirst.handle({ request });
      if (response) return response;
      // fallback ketika cache kosong dan jaringan gagal
      return caches.match('/offline.json');
    } catch {
      return caches.match('/offline.json');
    }
  }
);

// NetworkFirst dengan fallback manual untuk detail story
const storyDetailNetworkFirst = new NetworkFirst({
  cacheName: 'story-detail-cache',
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }),
  ],
});
registerRoute(
  ({ url }) =>
    url.origin === new URL(CONFIG.BASE_URL).origin &&
    /\/v1\/stories\/[^/]+$/.test(url.pathname),
  async ({ request }) => {
    try {
      const response = await storyDetailNetworkFirst.handle({ request });
      if (response) return response;
      return caches.match('/offline.json');
    } catch {
      return caches.match('/offline.json');
    }
  }
);

// Offline fallback untuk navigasi (halaman)
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
  }
});

// Push Notification Handler
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const title = data.title || 'Notifikasi Baru';
    const options = {
      body: data.options?.body || 'Ada pembaruan cerita.',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }
});
