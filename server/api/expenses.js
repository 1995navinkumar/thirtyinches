const express = require("express");
const router = express.Router();
const getDB = require("../mongo");


router.get("/:orgName", async function getAllExpense(req, res) {
    var db = await getDB();
    var { orgName } = req.params;

    var allowedBranches = req.userPrivileges.find(doc => doc.orgName == orgName).branches;

    var expenses = await db.collection("expenses")
        .find({
            orgName,
            branchName: { $in: allowedBranches }
        })
        .toArray()

    res.json(expenses);

})

router.post("/:orgName", async function newExpense(req, res) {
    var db = await getDB();

    var { orgName } = req.params;

    var { branchName, expenseDetail } = req.body;

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
