const express = require("express");
const router = express.Router();
const getDB = require("../mongo");
const appLogger = require("../logger/app-logger");
const { eTagFilter, setResourceUpdateTime } = require("../etag");
const { sendNotification } = require("../webpush");

const subscribersETagFilter = eTagFilter("subscribers");

router.get("/:orgName", async function checkETag(req, res, next) {
    subscribersETagFilter(req, res, next);
})

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

    subscribers = subscribers.map(subscriber => {
        return {
            ...subscriber,
            subscriptions: subscriber.subscriptions.sort((a, b) => {
                return new Date(b.end).getTime() - new Date(a.end).getTime();
            })
        }
    })

    subscribers.sort(({ subscriptions: subA }, { subscriptions: subB }) => {
        return new Date(subB[0].end).getTime() - new Date(subA[0].end).getTime();
    })

    res.json(subscribers);
})

router.post("/:orgName", async function addNewSubscription(req, res) {
    var db = await getDB(req.dbname);

    var { orgName } = req.params;

    var { subscriberDetail, subscriptionDetail } = req.body;

    subscriptionDetail.start = new Date(subscriptionDetail.start);
    subscriptionDetail.end = new Date(subscriptionDetail.end);

    try {
        await db.collection("subscribers")
            .insertOne({
                orgName,
                ...subscriberDetail,
                subscriptions: [subscriptionDetail]
            });


        var notificationMessage = {
            title: "New Subscription Added",
            options: {
                body: `Name : ${subscriberDetail.name} \nAmount : ${subscriptionDetail.amount}`
            }
        };

        sendNotification(db, req.uid, orgName, subscriptionDetail.branchName, notificationMessage);

        await setResourceUpdateTime(db, orgName, "subscribers");

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
