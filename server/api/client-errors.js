const express = require("express");
const router = express.Router();
const appLogger = require("../logger/app-logger");


router.post("/", async function (req, res, next) {
    var { error } = req.body;
    appLogger.error(error);
    res.json({
        message: "Reported Successfully"
    });
})

module.exports = router;
