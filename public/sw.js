
// Service Worker for Unique Health Nexus PWA

const CACHE_NAME = 'unique-health-cache-v2'; // Updated cache version
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/385afec9-6f8a-4281-9fd7-527f33ad1c96.png'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('Service Worker installing with new cache version');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force activation by skipping waiting
  self.skipWaiting();
});

// Clear old caches when activated
self.addEventListener('activate', event => {
  console.log('Service Worker activating and clearing old caches');
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from network first, then cache
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Network first strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response since it can only be consumed once
        const responseToCache = response.clone();

        // Only cache GET requests
        if (event.request.method === 'GET') {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {
        // If network fails, try serving from cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If both cache and network fail, show an offline fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          
          return new Response('Offline - ingen nettverkstilkobling');
        });
      })
  );
});

// Force update on message from client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Service Worker: received skip waiting instruction');
    self.skipWaiting();
  }
});
