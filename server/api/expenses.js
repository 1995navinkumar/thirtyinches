const express = require("express");
const router = express.Router();
const getDB = require("../mongo");


router.post("/add", async function newExpense(req, res) {
    var db = await getDB();

    var { orgName, branchName, expenseDetail } = req.body;

    await db.collection("expenses")
        .insertOne({
            orgName,
            branchName,
            ...expenseDetail
        });

    res.json({
        ...req.body
    });

});

module.exports = router;
