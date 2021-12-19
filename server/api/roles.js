const express = require("express");
const router = express.Router();
const getDB = require("../mongo");


router.post("/populate", async function populateDefaultRoles(req, res) {
    var db = await getDB();

    var { roles } = req.body;

    await db.collection("roles")
        .insertMany([...roles]);

    res.json({
        roles
    });

});

module.exports = router;
