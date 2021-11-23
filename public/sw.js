
var CACHE_NAME = 'resource-cache-v1';
var urlsToCache = [
    '/',
    '/index.html',
    '/css/app.css',
    '/js/bundle.js'
];

this.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
})


this.addEventListener('fetch', function (event) {
    // it can be empty if you just want to get rid of that error
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});