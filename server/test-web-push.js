const { getVapidKeys } = require("./webpush");
const webpush = require("web-push");

var subscriptions = [{
    "endpoint": "https://fcm.googleapis.com/fcm/send/dH0Y6F9q4WY:APA91bEsU3Ty5chwycaxJwiR4gBoC_VdfMJt0EaL2eqxWwj8eNS2HBjYmWdV88xY6raJcVq-62_lMT_5t5Gp8CFnyUwjIfln-r75-6Ud9UiRxd2CY0a1Tsh2QGVE9a4eL9SEhut611jI",
    "expirationTime": null,
    "keys": {
        "p256dh": "BGgCsVlIUSk5ih2pJQvy1rUwBi-T8f3e87ETAZVIxpwuhreTaYCOTRYES07n8LGZs0HJ0itqFM0OWcDBVg_PYeY",
        "auth": "iFt_7rKc34r9roJoh_uovw"
    }
}]

subscriptions.forEach(subscription => {
    webpush.sendNotification(subscription, JSON.stringify({
        title: "New Subscription Added",
        options: {}
    }))
        .then(console.log)
        .catch(console.log)
})

// process.exit(0);