const express = require("express");
const router = express.Router();
const getDB = require("../mongo");


router.get("/:orgName", async function getAllExpense(req, res) {
    var db = await getDB(req.dbname);
    var { orgName } = req.params;

    var allowedBranches = req.userPrivileges.find(doc => doc.orgName == orgName).branches;

    var expenses = await db.collection("expenses")
        .find({
            orgName,
            branchName: { $in: allowedBranches }
        })
        .project({
            _id: 0
        })
        .toArray()

    res.json(expenses);

})

router.post("/:orgName/category", async function addNewCategory(req, res) {
    var db = await getDB(req.dbname);
    var { orgName } = req.params;
    var { categoryName } = req.body;

    await db.collection("orgs")
        .updateOne(
            { orgName },
            {
                $push: { expenseCategories: categoryName }
            }
        )

    res.json({
        ...req.body
    })
})

router.post("/:orgName", async function newExpense(req, res) {
    var db = await getDB(req.dbname);

    var { orgName } = req.params;

    var { expenseDetail } = req.body;

    expenseDetail.billDate = new Date(expenseDetail.billDate);

    await db.collection("expenses")
        .insertOne({
            orgName,
            ...expenseDetail
        });

    let orgDoc = await db.collection("orgs")
        .findOne({ orgName });

    var allCategories = [...defaultCategories, ...orgDoc?.expenseCategories || []];

    if (!allCategories.includes(expenseDetail.category)) {
        await db.collection("orgs")
            .updateOne(
                { name: orgName },
                {
                    $push: { expenseCategories: expenseDetail.category }
                }
            )
    }

    res.json({
        ...req.body
    });

});

var defaultCategories = [
    "Maintenance",
    "Wage",
    "Asset Purchase",
    "Misc"
]

module.exports = router;
