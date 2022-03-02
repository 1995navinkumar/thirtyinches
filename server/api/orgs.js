const express = require("express");
const router = express.Router();
const getDB = require("../mongo");

const { asyncPipe } = require("../utils");

const { validate, composeValidators } = require('@sknk/object-validator');

const {
    maxDate,
    date,
    regex,
    truthy,
    minString
} = require('@sknk/object-validator/predicates');

router.post("/", async function createOrgAndBranch(req, res, next) {
    let db = await getDB(req.dbname);
    let { orgName, branchDetails } = req.body;
    let userId = req.uid;

    try {
        let org = await asyncPipe(PipedTasks.createNewOrgAndBranch({ db, userId }), { orgName, branchDetails });
        res.status(201);
        res.json({
            status: "success",
            message: "Org created successfully",
            data: {
                ...org,
                name: orgName,
                branchDetails
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500);
        res.json({
            message: error.message
        })
    }

})

router.get("/", async function getOrgDetails(req, res, next) {
    let db = await getDB(req.dbname);
    let userId = req.uid;
    let userPrivileges = req.userPrivileges;

    try {
        var orgDetail = await pureDBFns.getOrgDetails({ db, userPrivileges });
        res.json(orgDetail);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.json({
            message: error.message
        })
    }

})

router.post("/:orgName/branches", async function createBranch(req, res, next) {
    var db = await getDB(req.dbname);
    var orgName = req.params.orgName;
    var { branchDetails } = req.body;
    let userId = req.uid;

    try {
        var branchDetails = await asyncPipe(
            PipedTasks.createNewBranch({ db, userId }),
            { orgName, branchDetails }
        )

        res.json({
            orgName,
            branches: [branchDetails]
        })

    } catch (error) {
        console.log(error);
        res.status(500);
        res.json({
            status: "error",
            message: error.message
        })
    }

});

router.get("/:orgName/branches", async function getBranchDetails(req, res, next) {
    var db = await getDB(req.dbname);
    var orgName = req.params.orgName;

    try {
        var branches = await pureDBFns.getBranchesFromOrg({
            db,
            userPrivileges,
            orgName
        })

        res.json(branches[0])

    } catch (error) {
        res.status(500);
        res.json({
            status: "error",
            message: error.message
        })
    }
})


var pureDBFns = {

    createNewOrg: async function createNewOrg({ db, userId, orgName, branchDetails }) {
        var org = await db.collection("orgs")
            .insertOne({
                name: orgName,
                branches: [branchDetails]
            })

        await db.collection("userPrivileges")
            .insertOne({
                userId,
                orgName,
                roleName: "OrgAdmin",
                branches: [branchDetails.name]
            })

        return org;
    },

    createNewBranch: async function createNewBranch({ db, orgName, branchDetails, userId }) {
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
                    { userId, orgName },
                    {
                        $push: { branches: branchDetails.name }
                    }
                )

        return updatedOrg;
    },

    getOrgDetails: async function getOrgDetails({ db, userPrivileges }) {
        var allowedOrgs = userPrivileges.map(doc => doc.orgName);
        var allowedBranches = userPrivileges.flatMap(doc => doc.branches);
        return await db.collection("orgs")
            .aggregate([
                { $match: { name: { $in: allowedOrgs } } },
                {
                    $project: {
                        name: 1,
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
    }
}

var PipedTasks = {
    createNewOrgAndBranch: function createNewOrgAndBranch({ db, userId }) {
        return [
            async ({ orgName, branchDetails }) => {
                var validation = validate(minString(1))(["orgName", "name", "address", "contact"])
                validation({
                    orgName,
                    ...branchDetails
                })
                return { orgName, branchDetails };
            },
            async ({ orgName, branchDetails }) => {
                var isOrgNameTaken = await orgDBUtils.isOrgNameTaken({ db, orgName });
                // var isBranchNameTaken = await orgDBUtils.isBranchNameTaken({ db, orgName, branchName: branchDetails.name })

                if (isOrgNameTaken) {
                    throw new Error(`Org Name ${orgName} already taken`);
                }
                // if (isBranchNameTaken) {
                //     throw new Error("Branch already present");
                // }
                return {
                    orgName,
                    branchDetails
                }
            },
            async ({ orgName, branchDetails }) => {
                return await pureDBFns.createNewOrg({
                    orgName,
                    branchDetails,
                    db,
                    userId
                })
            }

        ]
    },
    createNewBranch: function createNewBranch({ db, userId }) {
        return [
            async ({ orgName, branchDetails }) => {
                var validation = validate(minString(1))(["orgName", "name", "address", "contact"])
                validation({
                    orgName,
                    ...branchDetails
                })
                return { orgName, branchDetails };
            },
            async ({ orgName, branchDetails }) => {
                // var isOrgNameTaken = await orgDBUtils.isOrgNameTaken({ db, orgName });
                var isBranchNameTaken = await orgDBUtils.isBranchNameTaken({ db, orgName, branchName: branchDetails.name })

                // if (isOrgNameTaken) {
                //     throw new Error(`Org Name ${orgName} already taken`);
                // }
                if (isBranchNameTaken) {
                    throw new Error("Branch already present");
                }
                return {
                    orgName,
                    branchDetails
                }
            },
            async ({ orgName, branchDetails }) => {
                return await pureDBFns.createNewBranch({
                    orgName,
                    branchDetails,
                    db,
                    userId
                })
            }
        ]
    }
}

var orgDBUtils = {
    isOrgNameTaken: async function isOrgNameTaken({ db, orgName }) {
        return await db.collection("orgs")
            .findOne({ name: orgName });
    },
    isBranchNameTaken: async function isBranchNameTaken({ db, orgName, branchName }) {
        return await db.collection("orgs")
            .findOne({
                name: orgName,
                "branches.name": branchName
            });
    }

}


module.exports = router;
