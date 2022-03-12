const webpush = require('web-push');

const fs = require("fs");

var vapidKeys = getVapidKeys();

webpush.setVapidDetails(
    'mailto:1995navinkumar@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);



function getVapidKeys() {
    if (fs.existsSync("vapidKeys.json")) {
        var keys = fs.readFileSync("vapidKeys.json");
        return JSON.parse(keys);
    } else {
        const vapidKeys = webpush.generateVAPIDKeys();
        fs.writeFileSync("vapidKeys.json", JSON.stringify(vapidKeys));
        return vapidKeys;
    }
}

var pushSubscriptions = [
    { "endpoint": "https://fcm.googleapis.com/fcm/send/eI70PJtnJb8:APA91bHJjuwRUorH6wsFAX9XTEhgdh0HNS1Zk8Efp6OGv-tCa2gkjA6_ToClz-KUwFre-MxnVZZpUB5DPuwpySXknOsL-ys_FplY-whzmvpxbaG_bG8QDdPt7Pkt3DIbvSKlc6luHl5u", "expirationTime": null, "keys": { "p256dh": "BDlQy9G2SmWmrqnwcU9gkpBZ2ZXXKZMxPQJ0TGgMBUnUw1T7TLf0s0cB090cVqXO2uadQnzaFoLfUbxSdyOdLTc", "auth": "r4OjmEOoBmP1XZLwKn_CTg" } },
    { "endpoint": "https://fcm.googleapis.com/fcm/send/eiq2gdtcW48:APA91bExeIzYE-CBRRDSHEgvfLKVvJ_p3OpgfTTECukKBr5H42AUxZXX2lZ7mzu0RWsJePbxL7JWm-Yv0ZvA_nQfSxfpcRwISODx20Z1lkEy-KxyTP2Mpp0NfcthKRGc0vmBbbLzAdRN", "expirationTime": null, "keys": { "p256dh": "BKngVy-0V5gwsY4lsp9zFAHADNzTtuZ8RrGXlBjsHzxvFWrsB_uLZOqZ3OMnUrwGluJA8Omd9V3w-qva01fYXFs", "auth": "zYWnaBOWNQ_K6So85gfenQ" } }
]

module.exports = {
    pushSubscriptions
}