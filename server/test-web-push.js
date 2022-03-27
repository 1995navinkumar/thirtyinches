const { getVapidKeys } = require("./webpush");
const webpush = require("web-push");

var subscriptions = [{
    "endpoint": "https://fcm.googleapis.com/fcm/send/df0ObWA5TeY:APA91bGSujP7XaEHwIiyNFKuqIWopvtNQuAAhi2TaQ5NtZvREBGjj-lECSd9eak10QnPi1NdRQSAcZlQlGnMxAWJ7UT_FCXj5lk9GQ4gQYagWtCQZdkFbykYdkeMZt_K2lLGwuPc-xk1",
    "expirationTime": null,
    "keys": {
        "p256dh": "BAyyzGIK-P4v8ZAtVpdHDSM--MDDgduxjo7kHAa1ynLJVNCNnTvGnvJeQNhh64Df_eae3qBT17ARvOT_KjYuXw8",
        "auth": "_uVwUa3QJ3kXdNhg2G4UaQ"
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