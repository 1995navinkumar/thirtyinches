const express = require("express");
const router = express.Router();
const getDB = require("../mongo");


router.get("/:orgName", async function getAllAssets(req, res) {
    var db = await getDB();
    var { orgName } = req.params;

    var allowedBranches = req.userPrivileges.find(doc => doc.orgName == orgName).branches;

    var assets = await db.collection("assets")
        .find({
            orgName,
            branchName: { $in: allowedBranches }
        })
        .toArray()

    res.json(assets);
})

router.post("/:orgName", async function newAsset(req, res) {
    var db = await getDB();
    var { orgName } = req.params;
    var { assetDetail } = req.body;

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
