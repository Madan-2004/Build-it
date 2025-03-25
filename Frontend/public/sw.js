// service-worker.js or sw.js

// Import Workbox
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';

// Set the maximum cache size to 5 MB (default is 2 MiB)
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

workbox.precaching.cleanupOutdatedCaches();

workbox.core.setCacheNameDetails({
  prefix: 'my-app',
  suffix: 'v1',
});

workbox.precaching.cleanupOutdatedCaches();

// Configure the maximum file size limit (5 MB in this example)
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST, {
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024  // 5 MiB
});

// Cache images with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        maxEntries: 50,
      }),
    ],
  })
);
