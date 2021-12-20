const express = require("express");
const router = express.Router();
const getDB = require("../mongo");


router.post("/:orgName/:contact", async function markAttendance(req, res) {
    var db = await getDB();

    var { orgName, contact } = req.params;
    var { branchName, timestamp } = req.body;

    await db.collection("attendance")
        .insertOne({
            orgName, branchName, contact, timestamp
        })

    res.json({
        orgName, branchName, contact, timestamp
    });

});

module.exports = router;
