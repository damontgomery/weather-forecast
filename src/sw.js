self.addEventListener('install', (event) => {
  // Perform install steps
});

// This doesn't actually do anything yet.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
