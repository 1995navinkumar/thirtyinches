const express = require("express");
const router = express.Router();
const getDB = require("../mongo");
const appLogger = require("../logger/app-logger");
const { eTagFilter, setResourceUpdateTime } = require("../etag");
const { sendNotification } = require("../webpush");

const assetsETagFilter = eTagFilter("assets");

router.get("/:orgName", async function checkETag(req, res, next) {
    assetsETagFilter(req, res, next);
})

router.get("/:orgName", async function getAllAssets(req, res) {
    var db = await getDB(req.dbname);
    var { orgName } = req.params;

    var allowedBranches = req.userPrivileges.find(doc => doc.orgName == orgName).branches;

    var assets = await db.collection("assets")
        .find({
            orgName,
            branchName: { $in: allowedBranches }
        })
        .project({
            _id: 0
        })
        .toArray()

    res.json(assets);
})

router.post("/:orgName", async function newAsset(req, res) {
    var db = await getDB(req.dbname);
    var { orgName } = req.params;
    var { assetDetail } = req.body;

    assetDetail.purchaseDate = new Date(assetDetail.purchaseDate || Date.now());

    await db.collection("assets")
        .insertOne({
            orgName,
            ...assetDetail
        });

    var notificationMessage = {
        title: "New Asset Added",
        options: {
            body: `Asset : ${assetDetail.assetName}\nPrice : ${assetDetail.price}\nQuantity : ${assetDetail.quantity}`
        }
    }

    sendNotification(db, req.uid, orgName, assetDetail.branchName, notificationMessage);

    await setResourceUpdateTime(db, orgName, "assets");


    res.json({
        ...req.body
    });

});

module.exports = router;
