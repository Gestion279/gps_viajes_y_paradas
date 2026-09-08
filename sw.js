// Service worker mínimo: solo existe para que el navegador considere el
// panel "instalable" (ícono en el escritorio / "Agregar a pantalla de
// inicio" en el celular) y para que, una vez abierto una vez, siga
// funcionando aunque no haya conexión.
const CACHE_NAME = 'flota-gps-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
  './icons/favicon.ico'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Estrategia: para los archivos propios (mismo origen), cache primero y
// red de respaldo. Para librerías externas (CDN), siempre red primero
// (para no quedar con una versión vieja), con la caché como respaldo si
// no hay conexión.
self.addEventListener('fetch', function(event){
  const req = event.request;
  const isSameOrigin = new URL(req.url).origin === self.location.origin;
  // El documento HTML (la navegación al panel en sí) es lo único que
  // realmente necesita estar siempre al día: si va con "caché primero"
  // como el resto, cualquier actualización del panel queda invisible
  // para quien ya lo tenga instalado/abierto, aunque haga un refresco
  // fuerte, porque el service worker sigue respondiendo con la copia
  // vieja sin consultar la red.
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') > -1;

  if(isSameOrigin && isHTML){
    event.respondWith(
      fetch(req).then(function(res){
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(req, resClone); });
        return res;
      }).catch(function(){
        return caches.match(req).then(function(cached){ return cached || caches.match('./index.html'); });
      })
    );
    return;
  }

  if(isSameOrigin){
    event.respondWith(
      caches.match(req).then(function(cached){
        return cached || fetch(req).then(function(res){
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(req, resClone); });
          return res;
        });
      }).catch(function(){ return caches.match('./index.html'); })
    );
  } else {
    event.respondWith(
      fetch(req).then(function(res){
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(req, resClone); });
        return res;
      }).catch(function(){ return caches.match(req); })
    );
  }
});
