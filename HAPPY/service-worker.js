const CACHE_NAME = 'HabitMaster v1.2.11';

const ASSETS_TO_CACHE = [
    'index.html',
    'style.css',
    'ico.css',
    'fa-solid-900.woff2',
    'logo.svg',
    'manifest.json',
    'JS/storage.js',
    'JS/core.js',
    'JS/ui.js',
    'JS/profiles.js',
    'JS/history.js',
    'JS/shop.js',
    'script.js'

];
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

