const BASE_PATH = '/budgeting-app';
const CACHE_NAME = 'budgeting-app-v2';

const APP_SHELL = [
  `${BASE_PATH}/`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Only handle requests belonging to this app.
  if (
    !requestUrl.pathname.startsWith(
      `${BASE_PATH}/`
    ) &&
    requestUrl.pathname !== BASE_PATH
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(
      (cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            if (
              !response ||
              response.status !== 200 ||
              response.type === 'opaque'
            ) {
              return response;
            }

            const responseClone =
              response.clone();

            caches.open(CACHE_NAME).then(
              (cache) => {
                cache.put(
                  event.request,
                  responseClone
                );
              }
            );

            return response;
          })
          .catch(() => {
            return caches.match(
              `${BASE_PATH}/`
            );
          });
      }
    )
  );
});