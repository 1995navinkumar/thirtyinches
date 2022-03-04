const express = require("express");
const router = express.Router();
const getDB = require("../mongo");
const appLogger = require("../logger/app-logger");

router.get("/:orgName", async function getSubscribers(req, res) {
    var db = await getDB(req.dbname);
    var { orgName } = req.params;

    var allowedBranches = req.userPrivileges.find(doc => doc.orgName == orgName).branches;

    var subscribers = await db.collection("subscribers")
        .aggregate([
            {
                $match: {
                    orgName,
                    "subscriptions.branchName": { $in: allowedBranches }
                }
            },
            {
                $project: {
                    name: 1,
                    address: 1,
                    dob: 1,
                    contact: 1,
                    subscriptions: {
                        $filter: {
                            input: "$subscriptions",
                            as: "subscription",
                            cond: {
                                $in: [
                                    "$$subscription.branchName", allowedBranches
                                ]
                            }
                        }
                    }
                }
            }
        ])
        .toArray()



    res.json(subscribers);
})

router.post("/:orgName", async function addNewSubscription(req, res) {
    var db = await getDB(req.dbname);

    var { orgName } = req.params;

    var { subscriberDetail, subscriptionDetail } = req.body;

    try {
        await db.collection("subscribers")
            .insertOne({
                orgName,
                ...subscriberDetail,
                subscriptions: [subscriptionDetail]
            });
        res.status(201);
        res.json({
            status: "success",
            message: "Subscription added successfully",
            data: {
                ...req.body
            }
        })
    } catch (error) {
        appLogger.error(error);
        res.status(500);
        res.json({
            message: error.message
        })
    }

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
