self.addEventListener('install', (e) => {
  console.log('[drfarm sw] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('[drfarm sw] Activated');
});

// A fetch listener is required to make the app "installable" (Trigger the 'Add to Home Screen' prompt)
// For now, it just bypasses to the network (no offline caching yet).
self.addEventListener('fetch', (e) => {
  // Doing nothing here lets the browser handle it natively
});
