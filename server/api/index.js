const express = require("express");
const router = express.Router();
const getDB = require("../mongo");
const orgs = require("./orgs");
const userprivilege = require("./user-privilege");
const roles = require("./roles");
const subscriptions = require("./subscriptions");
const attendance = require("./attendance");
const expenses = require("./expenses");
const assets = require("./assets");

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

router.use("/userprivilege", userprivilege);

router.use("/roles", roles);

router.use("/subscriptions", subscriptions);

router.use("/attendance", attendance);

router.use("/expenses", expenses);

router.use("/assets", assets);

module.exports = router;
