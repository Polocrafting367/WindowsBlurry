
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('polocrafting-cache').then((cache) => {
      return cache.addAll([
  'index.html',
  'Log.html',
  'JS.js',
  'script.js',
  'Work/index.html',
  'Work/chrono.html',
  'Work/style-chrono.css',
  'Work/Script-chrono.js',
  'Work/unorm.js',
  'Work/style.js',
  'Work/Lieu.js',
  'Work/Cookies.js',
  'Work/Script.js',
  'Work/GestionIframe.js',
  'Work/Préconf.js',
  'Work/ModalArbre.js',
  'Work/AffichageEtGestionLieu.js',
  'Work/GestCSV.js',
  'Work/GestionInterSauvegarde.js',
  'logo-app.ico',
  'manifest.json'
      ]);
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
