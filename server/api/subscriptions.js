const express = require("express");
const router = express.Router();
const getDB = require("../mongo");


router.post("/add", async function addSubscription(req, res) {
    var db = await getDB();

    var { orgName, branchName, subscriberDetail, subscriptionDetail } = req.body;

    await db.collection("subscribers")
        .updateOne(
            {
                contact: subscriberDetail.contact
            },
            {
                $set: { orgName, branchName, ...subscriberDetail },
                $push: { subscriptions: subscriptionDetail }
            },
            {
                upsert: true
            });

    res.json({
        orgName,
        branchName,
        subscriberDetail,
        subscriptionDetail
    });

});

module.exports = router;
