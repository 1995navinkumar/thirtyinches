const express = require("express");
const router = express.Router();
const getDB = require("../mongo");

router.post("/create-branch", async (req, res, next) => {
    var db = await getDB();
    let { body } = req;

    var { orgName, branchDetails } = body;

    await db.collection("orgs")
        .updateOne(
            { name: orgName },
            {
                $push: { branches: branchDetails }
            },
            { upsert: true }
        )

    return res.json({
        name: orgName,
        branches: [branchDetails]
    })
});

router.get("/list", async (req, res, next) => {
    var db = await getDB();
    var userId = req.uid;
})

module.exports = router;
