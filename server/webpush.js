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



module.exports = {
    getVapidKeys
}