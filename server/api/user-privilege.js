const express = require("express");
const router = express.Router();
const getDB = require("../mongo");


router.post("/add", async function createNewUserPrivilege(req, res) {
    var db = await getDB();

    var details = {
        userId: req.body.userId,
        roleName: req.body.roleName,
        orgName: req.body.orgName,
        branches: req.body.branches
    }

    await db.collection("userPrivileges")
        .insertOne({
            ...details
        });

    res.json({
        ...details
    });

});

module.exports = router;
