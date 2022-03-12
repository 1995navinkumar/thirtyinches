
var CACHE_NAME = 'resource-cache-v1';

var urlsToCache = $$;

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );

})


self.addEventListener('fetch', function (event) {
    // it can be empty if you just want to get rid of that error
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request);
        })
    );
});

self.onpush = function (event) {
    var message = event.data?.json();
    self.registration.showNotification(message.name);
    // From here we can write the data to IndexedDB, send it to any open
    // windows, display a notification, etc.
}