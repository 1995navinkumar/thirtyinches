const webpush = require('web-push');
const { getUsersWithPrivilege, getPushSubscriptionsForUsers } = require("./db-util");
const notificationLogger = require("./logger/notification-logger");


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


async function sendNotification(db, userId, orgName, branchName, notification) {
    var usersWithPrivilege = await getUsersWithPrivilege(db, orgName, [branchName]);

    var otherUsersWithSamePrivilege = usersWithPrivilege.filter(user => user.userId != userId).map(user => user.userId);

    var pushSubscriptions = await getPushSubscriptionsForUsers(db, otherUsersWithSamePrivilege);

    notificationLogger.info(JSON.stringify(pushSubscriptions));

    pushSubscriptions
        .flatMap(pushSubscription => pushSubscription.subscriptions)
        .forEach(push => {
            webpush.sendNotification(push, JSON.stringify(notification))
                .then(notificationLogger)
                .catch(notificationLogger);
        })
}

module.exports = {
    getVapidKeys,
    sendNotification
}