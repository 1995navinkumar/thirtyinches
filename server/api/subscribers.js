const express = require("express");
const router = express.Router();
const getDB = require("../mongo");
const appLogger = require("../logger/app-logger");
const { getUsersWithPrivilege, getPushSubscriptionsForUsers } = require("../db-util");
const webpush = require("web-push");

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


        var userId = req.uid;

        var usersWithPrivilege = await getUsersWithPrivilege(db, orgName, subscriptionDetail.branchName);

        var otherUsersWithSamePrivilege = usersWithPrivilege.filter(user => user.userId != userId).map(user => user.userId);

        var pushSubscriptions = await getPushSubscriptionsForUsers(db, otherUsersWithSamePrivilege);

        appLogger.info(JSON.stringify(pushSubscriptions));

        pushSubscriptions
            .flatMap(pushSubscription => pushSubscription.subscriptions)
            .forEach(push => {
                webpush.sendNotification(push, JSON.stringify({
                    title: "New Subscription Added",
                    options: {
                        body: `Name : ${subscriberDetail.name} \nAmount : ${subscriptionDetail.amount}`
                    }
                }));
            })

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
