const express = require("express");
const router = express.Router();
const getDB = require("../mongo");
const appLogger = require("../logger/app-logger");
const { getVapidKeys } = require("../webpush");
const { logoutHandlers } = require("../auth-handler");


router.post("/", async function savePushSubscription(req, res, next) {
    let db = await getDB(req.dbname);
    let pushSubscription = req.body;
    let userId = req.uid;
    console.log(pushSubscription, userId);

    await db.collection("pushSubscription")
        .updateOne(
            { userId },
            { $push: { subscriptions: pushSubscription } },
            { upsert: true }
        )

    // save to db
    // user can have multiple subscriptions (devices)

    res.json({ message: "success" });
})

router.get("/serverkey", async function sendPublicKey(req, res, next) {
    try {
        var vapidKeys = getVapidKeys();
        res.json({
            applicationServerKey: vapidKeys.publicKey
        })

    } catch (err) {
        appLogger.error(err);
    }
})

router.post("/silentNotification", async function silentPushNotification(req, res, next) {
    let db = await getDB(req.dbname);
    // Mark the notification as silent. This may be due to user logout or user settings

})

logoutHandlers.push(async function (req) {
    var db = await getDB(req.dbname);
    // unsubscribe push notification

    var userId = req.uid;
    var { pushSubscription } = req.body;

    var endpoint = pushSubscription.endpoint;

    await db.collection("pushSubscription")
        .updateOne(
            { userId },
            {
                $pull: { subscriptions: { endpoint } }
            }
        )

    return req;
})

module.exports = router;
