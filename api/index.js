const express = require("express");
const router = express.Router();
const orgs = require("./orgs");
const getDB = require("../mongo");

router.get("/usermeta", async (req, res, next) => {
    var db = await getDB();

    var players = await db.collection("players")
        .find({})
        .toArray()

    return res.json({
        usermeta: "usermeta",
        players
    })
});

router.use("/orgs", orgs);

module.exports = router;
