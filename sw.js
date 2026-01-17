// Service Worker for Klaus Portfolio
const CACHE_NAME = 'klaus-portfolio-v2';
const RUNTIME_CACHE = 'klaus-runtime-v2';

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/ad-styles.css',
  '/img/favicon-optimized.png',
  '/img/apple-touch-icon.png',
  '/img/icon-192x192.png',
  '/img/icon-512x512.png'
];

// Additional assets to cache on demand
const CACHEABLE_ASSETS = [
  '/ads.txt',
  '/img/screenshot-desktop.png',
  '/img/screenshot-mobile.png',
  '/Resume.pdf',
  '/projects.html',
  '/blog.html',
  '/resume.html',
  '/tutorials.html',
  '/case-studies.html',
  '/privacy.html',
  '/terms.html',
  '/disclaimer.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Critical assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache critical assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME && cache !== RUNTIME_CACHE) {
              console.log('Service Worker: Deleting old cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated and claimed clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip all non-HTTP requests and chrome-extension
  if (!event.request.url.startsWith('http') || event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Skip AdSense requests - let them always fetch from network
  if (event.request.url.includes('googlesyndication.com') || event.request.url.includes('google-analytics.com')) {
    return fetch(event.request);
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        return fetch(event.request)
          .then((fetchResponse) => {
            // Cache successful responses for GET requests
            if (fetchResponse.status === 200 && event.request.method === 'GET') {
              // Check if response should be cached
              const shouldCache = CACHEABLE_ASSETS.some(asset => 
                event.request.url.includes(asset) || 
                event.request.url.endsWith('.css') ||
                event.request.url.endsWith('.js') ||
                event.request.url.endsWith('.png') ||
                event.request.url.endsWith('.jpg') ||
                event.request.url.endsWith('.webp')
              );
              
              if (shouldCache) {
                const responseClone = fetchResponse.clone();
                caches.open(RUNTIME_CACHE)
                  .then((cache) => {
                    cache.put(event.request, responseClone).catch(() => {
                      // Ignore cache put errors
                    });
                  });
              }
            }
            return fetchResponse;
          })
          .catch((error) => {
            console.log('Service Worker: Network failed, trying cache:', error);
            // Return a custom offline page for HTML requests
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            // Return a basic response for other requests
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});

// Background sync for analytics (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

function syncAnalytics() {
  // Implement analytics sync logic here
  return Promise.resolve();
}
