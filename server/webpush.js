const webpush = require('web-push');

const fs = require("fs");

var vapidKeys = getVapidKeys();

webpush.setVapidDetails(
    'mailto:1995navinkumar@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

function getVapidKeys() {
    var keys = fs.readFileSync("vapidKeys.json");
    return JSON.parse(keys);
}

module.exports = {
    getVapidKeys
}