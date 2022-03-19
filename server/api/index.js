const express = require("express");
const router = express.Router();
const orgs = require("./orgs");
const userprivilege = require("./user-privilege");
const roles = require("./roles");
const subscribers = require("./subscribers");
const attendance = require("./attendance");
const expenses = require("./expenses");
const assets = require("./assets");
const personalisation = require("./personalisation");
const dashboard = require("./dashboard");
const pushSubscription = require("./pushSubscription");

router.use("/dashboard", dashboard);

router.use("/orgs", orgs);

router.use("/userprivilege", userprivilege);

router.use("/roles", roles);

router.use("/subscribers", subscribers);

router.use("/attendance", attendance);

router.use("/expenses", expenses);

router.use("/assets", assets);

router.use("/personalisation", personalisation);

router.use("/pushSubscription", pushSubscription);

module.exports = router;
