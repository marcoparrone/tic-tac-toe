importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.routing.registerRoute(
  /.*googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'googleapis',
  })
);

workbox.routing.registerRoute(
  /.*gstatic\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'gstatic',
  })
);

workbox.routing.registerRoute(
  /.*marcoparrone\.github\.io.*/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'marcoparrone',
  })
);
