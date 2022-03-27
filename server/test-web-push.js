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

/*
 {
    "endpoint": "https://fcm.googleapis.com/fcm/send/dbDcNjooESo:APA91bHe3hgFgmtpXhyLFTzNiIk5rvjK4oVi0IyA3p2g1qeE6IRkC4o-aVt93tZ-qoPo8JF3sakfyXjKIp-UQt1wmPgL4Q0tJiE5fOEyIAzinK1BJ_VHmaGS0WH_j4Pv6vigyJNI10-N",
    "expirationTime": null,
    "keys": {
        "p256dh": "BC1i01dSbASaLvqZ6LsVAgOGXiCs_gBsaF-kHSKKwgbX0xNRGL7XkcriZBLBMCamrJOikA7Bp1lSzV9n0YTkhRg",
        "auth": "J28iF2n-NpS7HFq60vIJlg"
    }
}
*/

subscriptions.forEach(subscription => {
    webpush.sendNotification(subscription, JSON.stringify({
        title: "New Subscription Added",
        options: {
            body: "Name : Navin",
            icon: "pwa/manifest-icon-512.maskable.png",
            badge: "logo-group.png"
        }
    }))
        .then(console.log)
        .catch(console.log)
})

// process.exit(0);