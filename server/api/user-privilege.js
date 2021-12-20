const express = require("express");
const router = express.Router();
const getDB = require("../mongo");


router.post("/", async function createNewUserPrivilege(req, res) {
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

router.get("/", async function getUserPrivileges(req, res, next) {
    res.json({
        privileges: req.userPrivileges
    })
})

module.exports = router;
