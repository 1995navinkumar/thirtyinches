const express = require("express");
const router = express.Router();
const getDB = require("../mongo");

router.get("/:orgName", async function getSubscribers(req, res) {
    var db = await getDB(req.dbname);
    var { orgName } = req.params;

    var allowedBranches = req.userPrivileges.find(doc => doc.orgName == orgName).branches;

    var subscribers = await db.collection("subscribers")
        .find(
            { orgName, branchName: { $in: allowedBranches } }
        )
        .toArray();

    res.json(subscribers);
})

router.post("/:orgName", async function addNewSubscription(req, res) {
    var db = await getDB(req.dbname);

    var { orgName } = req.params;

    var { subscriberDetail, subscriptionDetail } = req.body;

    await db.collection("subscribers")
        .insertOne({
            orgName,
            ...subscriberDetail,
            subscriptions: subscriptionDetail
        });

    res.json({
        ...req.body
    });

});

router.post("/:orgName/:contact/subscriptions", async function renewSubscription(req, res) {
    var db = await getDB(req.dbname);

    var { orgName, contact } = req.params;
    var { subscriptionDetail } = req.body;

    subscriptionDetail.start = new Date(subscriptionDetail.start);
    subscriptionDetail.end = new Date(subscriptionDetail.end);

    await db.collection("subscribers")
        .updateOne(
            {
                contact: +contact,
                orgName
            },
            {
                $push: { subscriptions: subscriptionDetail }
            });

    res.json({
        ...req.body
    })

})


module.exports = router;
