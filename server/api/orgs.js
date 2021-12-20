const express = require("express");
const router = express.Router();
const getDB = require("../mongo");

router.post("/", async function createNewOrg(req, res, next) {
    var db = await getDB();
    let { orgName } = req.body;

    try {
        var org = await db.collection("orgs")
            .insertOne({
                name: orgName
            })

        await
            db.collection("userPrivileges")
                .insertOne({
                    userId: req.uid,
                    orgName,
                    roleName: "OrgAdmin",
                    branches: []
                })

        res.status(201);
        res.json({
            status: "success",
            message: "Org created successfully",
            data: {
                ...org,
                name: orgName
            }
        })
    } catch (error) {
        res.status(500);
        res.json({
            status: "error",
            message: error
        })
    }

})

router.post("/:orgName/branches", async function createNewBranch(req, res, next) {
    var db = await getDB();
    var orgName = req.params.orgName;
    var { branchDetails } = req.body;

    try {
        var updatedOrg = await db.collection("orgs")
            .updateOne(
                { name: orgName },
                {
                    $push: { branches: branchDetails }
                }
            )

        await
            db.collection("userPrivileges")
                .updateOne(
                    { userId: req.uid, orgName },
                    {
                        $push: { branches: branchDetails.name }
                    }
                )

        res.json({
            orgName,
            branches: [branchDetails]
        })

    } catch (error) {
        res.status(500);
        res.json({
            status: "error",
            message: error
        })
    }

});

router.get("/:orgName/branches", async function (req, res, next) {
    var db = await getDB();
    var orgName = req.params.orgName;

    try {
        var allowedBranches = req.userPrivileges.find(doc => doc.orgName == orgName).branches;

        var branches = await
            db.collection("orgs")
                .aggregate([
                    { $match: { name: orgName } },
                    {
                        $project: {
                            branches: {
                                $filter: {
                                    input: "$branches",
                                    as: "branch",
                                    cond: { $in: ["$$branch.name", allowedBranches] }
                                }
                            }
                        }
                    }
                ])
                .toArray()

        res.json(branches[0])

    } catch (error) {
        res.status(500);
        res.json({
            status: "error",
            message: error
        })
    }
})


module.exports = router;
