/* Self-destructing worker.

   Offline caching was serving a shell from an earlier build, which showed a
   token setup screen that no longer exists in the app. Deleting the home-screen
   icon does not clear a registered worker, so the stale page kept coming back.
   This version installs, wipes every cache, unregisters itself, and reloads any
   open window. It defines no fetch handler, so requests go straight to the
   network. */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: 'window' });
    windows.forEach((c) => { try { c.navigate(c.url); } catch (err) {} });
  })());
});
