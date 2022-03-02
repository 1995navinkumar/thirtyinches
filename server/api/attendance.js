const express = require("express");
const router = express.Router();
const getDB = require("../mongo");
const appLogger = require("../logger/app-logger");



router.post("/:orgName/:contact", async function markAttendance(req, res) {
    var db = await getDB(req.dbname);

    var { orgName, contact } = req.params;
    var { branchName, timestamp } = req.body;

    await db.collection("attendance")
        .insertOne({
            orgName, branchName, contact,
            timestamp: new Date(timestamp)
        })

    res.json({
        orgName, branchName, contact, timestamp
    });

});

module.exports = router;
