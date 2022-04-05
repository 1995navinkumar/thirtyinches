
var CACHE_NAME = 'resource-cache-v1';

var urlsToCache = [
    "/",
    "/404.html",
    "/Lato/Lato-Black.ttf",
    "/Lato/Lato-BlackItalic.ttf",
    "/Lato/Lato-Bold.ttf",
    "/Lato/Lato-BoldItalic.ttf",
    "/Lato/Lato-Hairline.ttf",
    "/Lato/Lato-HairlineItalic.ttf",
    "/Lato/Lato-Italic.ttf",
    "/Lato/Lato-Light.ttf",
    "/Lato/Lato-LightItalic.ttf",
    "/Lato/Lato-Regular.ttf",
    "/Lato/OFL.txt",
    "/css/app.css",
    "/css/helper.css",
    "/css/user-agent.css",
    "/css/paged.css",
    "/css/pdf.css",
    "/index.html",
    "/js/bundle.js"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
})

const putInCache = async (request, response) => {
    if (request.method == "POST") { return };
    const cache = await caches.open("resource-cache-v1");
    await cache.put(request, response);
};

self.addEventListener('fetch', async function (event) {
    event.respondWith(
        fetch(event.request)
            .then(res => {
                putInCache(event.request, res.clone());
                return res;
            })
            .catch(function () {
                return caches
                    .match(event.request)
                    .then(res => res ? res : caches.match("/404.html"))
            })
    );
});

self.onpush = function (event) {
    var message = event.data?.json();
    self.registration.showNotification(message.title, { ...defaultOptions, ...message.options });
}

let defaultOptions = {
    icon: "pwa/manifest-icon-512.maskable.png",
    badge: "notification-icon.png"
}
