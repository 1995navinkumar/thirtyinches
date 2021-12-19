const express = require("express");
const bodyParser = require("body-parser");
const { httpLogger, errorLogger } = require("./logger");
const api = require("./api");
var compression = require('compression')

const admin = require("firebase-admin");

const { getAuth } = require("firebase-admin/auth");

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(compression());

app.use(express.static("public"));


app.use(httpLogger); // log req, res 
app.use(bodyParser.json());

app.use("/api", async function (req, res, next) {
    var headers = req.headers;
    var authorization = headers.authorization || "";
    var [type, jwt] = authorization?.split(" ") || [];

    var authorized = process.env.NODE_ENV == "development";

    if (process.env.NODE_ENV != "development" && jwt && jwt.length > 0) {
        try {
            var decodedToken = await getAuth().verifyIdToken(jwt);
            console.log(decodedToken)
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
})

app.use("/api", api);


app.use(errorLogger, function (err, req, res, next) {
    // sanity
    if (res.headerSent) { return next(err) };
    // an error passed without statusCode is assinged 500
    err.statusCode = (err.statusCode) ? err.statusCode : 500;
    res.status(err.statusCode).send(err);
});

// listen for request
app.listen(process.env.PORT || 8800, function () {
    console.log('server running on PORT', process.env.PORT || 8800);
});
