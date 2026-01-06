const CACHE_NAME = 'klaus-portfolio-v3';
const STATIC_CACHE = 'klaus-static-v3';
const DYNAMIC_CACHE = 'klaus-dynamic-v3';
const IMAGE_CACHE = 'klaus-images-v3';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/critical.css',
  '/core.js',
  '/manifest.json',
  '/ad-manager.js',
  '/ad-styles.css'
];

// Static resources to cache
const STATIC_RESOURCES = [
  '/projects.html',
  '/case-studies.html',
  '/insights.html',
  '/blog.html',
  '/tutorials.html',
  '/resume.html',
  '/privacy.html',
  '/terms.html',
  '/disclaimer.html',
  '/non-critical.css',
  '/enhancements.js',
  '/image-optimizer.js',
  '/web-vitals.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Images to cache with different strategies
const IMAGE_RESOURCES = [
  '/img/profile.jpg',
  '/img/profile.webp',
  '/img/hero-bg.jpg',
  '/img/hero-bg.webp',
  '/img/favicon-optimized.png',
  '/img/twiga-threads.jpg',
  '/img/churnguard.jpg',
  '/img/questmate.jpg',
  '/img/mydiary.jpg',
  '/img/coding-image.jpg'
];

// Cache strategies
const cacheStrategies = {
  // Cache first for static assets
  cacheFirst: (request) => {
    return caches.match(request).then(response => {
      if (response) {
        return response;
      }
      return fetch(request).then(response => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(STATIC_CACHE).then(cache => {
          cache.put(request, responseToCache);
        });
        return response;
      });
    });
  },

  // Network first for dynamic content
  networkFirst: (request) => {
    return fetch(request).then(response => {
      if (!response || response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const responseToCache = response.clone();
      caches.open(DYNAMIC_CACHE).then(cache => {
        cache.put(request, responseToCache);
      });
      return response;
    }).catch(() => {
      return caches.match(request);
    });
  },

  // Stale while revalidate for frequently updated content
  staleWhileRevalidate: (request) => {
    return caches.match(request).then(response => {
      const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      });
      return response || fetchPromise;
    });
  },

  // Cache only for images
  cacheOnly: (request) => {
    return caches.match(request);
  }
};

// Install event - cache critical resources first
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cache critical resources immediately
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      // Cache static resources
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      }),
      // Cache images
      caches.open(IMAGE_CACHE).then(cache => {
        console.log('Caching images');
        return cache.addAll(IMAGE_RESOURCES);
      })
    ]).then(() => {
      console.log('All resources cached successfully');
      return self.skipWaiting();
    }).catch(error => {
      console.error('Failed to cache resources:', error);
    })
  );
});

// Fetch event - implement different caching strategies
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Force cache bypass for development and updates
  const cacheBust = url.searchParams.get('v');
  if (cacheBust) {
    // Always fetch fresh when cache busting parameter exists
    event.respondWith(fetch(request));
    return;
  }

  // Handle different resource types
  if (url.pathname.startsWith('/img/')) {
    // Images: Cache first with fallback
    event.respondWith(cacheStrategies.cacheFirst(request));
  } else if (STATIC_RESOURCES.some(resource => url.pathname === resource)) {
    // Static assets: Cache first
    event.respondWith(cacheStrategies.cacheFirst(request));
  } else if (CRITICAL_RESOURCES.some(resource => url.pathname === resource)) {
    // Critical resources: Cache only (already cached during install)
    event.respondWith(cacheStrategies.cacheOnly(request));
  } else if (url.origin === self.location.origin) {
    // Same-origin pages: Network first
    event.respondWith(cacheStrategies.networkFirst(request));
  } else {
    // External resources: Stale while revalidate
    event.respondWith(cacheStrategies.staleWhileRevalidate(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle any offline actions here
  console.log('Background sync triggered');
  return Promise.resolve();
}

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/img/icon-192x192.png',
    badge: '/img/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/img/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/img/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Klaus Portfolio', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Cache cleanup and management
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE &&
              !cacheName.startsWith('klaus-')) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Cache cleanup completed');
      // Force update of all clients
      return self.clients.claim();
    })
  );
});

// Message listener for cache clearing
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic cache cleanup (every 24 hours)
setInterval(() => {
  caches.open(DYNAMIC_CACHE).then(cache => {
    cache.keys().then(requests => {
      requests.forEach(request => {
        // Remove items older than 24 hours from dynamic cache
        cache.match(request).then(response => {
          if (response) {
            const date = response.headers.get('date');
            if (date) {
              const responseDate = new Date(date);
              const now = new Date();
              const hoursDiff = (now - responseDate) / (1000 * 60 * 60);
              if (hoursDiff > 24) {
                cache.delete(request);
              }
            }
          }
        });
      });
    });
  });
}, 24 * 60 * 60 * 1000); // 24 hours

// Message handling for cache management
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Force update specific cache
    const url = event.data.url;
    caches.open(DYNAMIC_CACHE).then(cache => {
      cache.delete(url).then(() => {
        fetch(url).then(response => {
          if (response && response.status === 200) {
            cache.put(url, response);
          }
        });
      });
    });
  }
});
