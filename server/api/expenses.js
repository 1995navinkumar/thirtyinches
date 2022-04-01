const express = require("express");
const router = express.Router();
const getDB = require("../mongo");
const { eTagFilter, setResourceUpdateTime } = require("../etag");
const { sendNotification } = require("../webpush");

const expensesETagFilter = eTagFilter("expenses");

router.get("/:orgName", async function checkETag(req, res, next) {
    expensesETagFilter(req, res, next);
})

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
        .findOne({ name: orgName });

    console.log(orgDoc.expenseCategories);

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

    var notificationMessage = {
        title: "New Expense Added",
        options: {
            body: `Title : ${expenseDetail.title}\n Amount : ${expenseDetail.amount}`
        }
    }

    sendNotification(db, req.uid, orgName, expenseDetail.branchName, notificationMessage);

    await setResourceUpdateTime(db, orgName, "expenses");

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
