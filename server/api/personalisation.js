const express = require("express");
const router = express.Router();
const getDB = require("../mongo");

router.put("/", async function addPersonalisedData(req, res, next) {
    var db = await getDB(req.dbname);
    var { data } = req.body;
    await db.collection("personalisation")
        .updateOne({
            userId: req.uid
        }, {
            $set: { ...data }
        }, {
            upsert: true
        })

    res.json({
        message: "success"
    })
});

router.get("/", async function getPersonalisedData(req, res, next) {
    var db = await getDB(req.dbname);
    var data = await db.collection("personalisation").findOne({ userId: req.uid });
    res.json(data || {});
})

module.exports = router;
