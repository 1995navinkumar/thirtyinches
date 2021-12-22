const admin = require("firebase-admin");

const { getAuth } = require("firebase-admin/auth");

const getDB = require("./mongo");

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var demoAccounts = [
    "Uq6uheVxXlNsr217p64xdmE01C72"
]

async function authHandler(req, res, next) {
    var headers = req.headers;
    var authorization = headers.authorization || "";
    var [type, jwt] = authorization?.split(" ") || [];

    var mode = process.env.NODE_ENV;

    var authorized;

    if (mode == "development") {
        var uid = req.headers.uid;
        authorized = uid.length > 0 && jwt && jwt.length > 0;
        if (authorized) {
            req.uid = uid;
            req.dbname = "demo";
            req.userPrivileges = await getUserPrivileges(req, uid);
        }
    }

    if (mode != "development" && jwt && jwt.length > 0) {
        try {
            var decodedToken = await getAuth().verifyIdToken(jwt);
            var usermail = decodedToken.email;

            var isDemoMode = demoAccounts.includes(decodedToken.uid) && req.headers.demomode == "true";

            console.log(`isDemoMode : ${isDemoMode}`, decodedToken.uid);

            if (isDemoMode) {
                req.dbname = "demo";
            }

            req.uid = usermail;
            req.userPrivileges = await getUserPrivileges(req, usermail);
            authorized = true;
        } catch (er) {
            console.log(er);
        }

    }

    if (authorized) {
        next();
    } else {
        res.status(401);
        res.send("Invalid Token");
        res.end();
    }
}

async function getUserPrivileges(req, userId) {
    var db = await getDB(req.dbname);
    return await
        db.collection("userPrivileges")
            .find({
                userId
            })
            .toArray()
}

module.exports = authHandler;