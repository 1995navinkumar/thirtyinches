const express = require("express");
const bodyParser = require("body-parser");
const { httpLogger, errorLogger } = require("./server/logger");
const api = require("./server/api");
const compression = require('compression');
require("./server/webpush");

const authHandler = require("./server/auth-handler");

const app = express();

app.use(compression());

app.use(express.static("public"));


app.use(httpLogger); // log req, res 
app.use(bodyParser.json());

app.use("/api", authHandler);

app.use("/api", api);

app.use(errorLogger, function (err, req, res, next) {
    // sanity
    if (res.headerSent) { return next(err) };
    // an error passed without statusCode is assigned 500
    err.statusCode = (err.statusCode) ? err.statusCode : 500;
    res.status(err.statusCode).send(err);
});

// listen for request
app.listen(process.env.PORT || 8800, function () {
    console.log('server running on PORT', process.env.PORT || 8800);
});

process.on('uncaughtException', (err) => {
    console.log(err);
});
