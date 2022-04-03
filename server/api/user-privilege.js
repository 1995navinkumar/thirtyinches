const express = require("express");
const { getUsersWithPrivilege } = require("../db-util");
const appLogger = require("../logger/app-logger");
const router = express.Router();
const getDB = require("../mongo");


router.post("/", async function createNewUserPrivilege(req, res) {
    var db = await getDB(req.dbname);

    var details = {
        userId: req.body.userId,
        roleName: req.body.roleName,
        orgName: req.body.orgName,
        branches: req.body.branches
    }

    await db.collection("userPrivileges")
        .insertOne({
            ...details
        });

    res.json({
        ...details
    });

});

router.get("/", async function getUserPrivileges(req, res, next) {
    res.json({
        privileges: req.userPrivileges
    })
})

router.get("/:orgName/managed-users", async function getManagedUsers(req, res, next) {
    var db = await getDB(req.dbname);
    var { orgName } = req.params;
    var { userPrivileges } = req;

    var org = userPrivileges.find(privilege => privilege.orgName == orgName);

    var roleName = org?.roleName;

    var isAdmin = roleName == "OrgAdmin";

    if (!isAdmin) {
        res.status(401);
        res.json({
            message: "Not authorised to  view this"
        })
    }

    var branches = org.branches;

    var allUsers = await getUsersWithPrivilege(db, orgName, branches);
    var managedUsers = allUsers.filter(user => user.userId != req.uid);
    return res.json(managedUsers);
})

module.exports = router;
