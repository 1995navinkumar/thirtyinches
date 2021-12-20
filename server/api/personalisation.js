const express = require("express");
const router = express.Router();
const getDB = require("../mongo");

router.put("/", async function addPersonalisedData(req, res, next) {
    var db = await getDB();
    var { data } = req.body;
    await db.collection("personalisation")
        .replaceOne({
            userId: req.uid
        }, {
            userId: req.uid,
            ...data
        }, {
            upsert: true
        })

    res.json({
        message: "success"
    })
});

router.get("/", async function getPersonalisedData(req, res, next) {
    var db = await getDB();
    var data = await db.collection("personalisation").findOne({ userId: req.uid });
    res.json(data || {});
})

module.exports = router;
