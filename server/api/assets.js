const express = require("express");
const router = express.Router();
const getDB = require("../mongo");


router.post("/add", async function newAsset(req, res) {
    var db = await getDB();

    var { orgName, branchName, assetDetail } = req.body;

    await db.collection("assets")
        .insertOne({
            orgName,
            branchName,
            ...assetDetail
        });

    res.json({
        ...req.body
    });

});

module.exports = router;
