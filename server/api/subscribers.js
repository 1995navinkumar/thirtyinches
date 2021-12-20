const express = require("express");
const router = express.Router();
const getDB = require("../mongo");

router.get("/:orgName", async function getSubscribers(req, res) {
    var db = await getDB();
    var { orgName } = req.params;

    var allowedBranches = req.userPrivileges.find(doc => doc.orgName == orgName).branches;

    var subscribers = await db.collection("subscribers")
        .find(
            { orgName, branchName: { $in: allowedBranches } }
        )
        .toArray();

    res.json(subscribers);
})

router.post("/:orgName", async function addSubscriber(req, res) {
    var db = await getDB();

    var orgName = req.params.orgName;

    var { branchName, subscriberDetail } = req.body;

    await db.collection("subscribers")
        .insertOne({
            orgName,
            branchName,
            ...subscriberDetail
        });

    res.json({
        ...req.body
    });

});

router.post("/:orgName/:contact/subscriptions", async function addSubscriptions(req, res) {
    var db = await getDB();

    var { orgName, contact } = req.params;
    var { subscriptionDetail } = req.body;

    await db.collection("subscribers")
        .updateOne(
            {
                contact : +contact,
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
