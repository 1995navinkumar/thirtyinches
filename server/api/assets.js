const express = require("express");
const router = express.Router();
const getDB = require("../mongo");
const appLogger = require("../logger/app-logger");
const webpush = require("web-push");

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

    res.json({
        ...req.body
    });

});

module.exports = router;
