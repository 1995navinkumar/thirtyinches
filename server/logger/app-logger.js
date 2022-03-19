const bunyan = require("bunyan");

var mode = process.env.NODE_ENV;

var options = mode == "production"
    ? { name: "app-logger" }
    : {
        name: 'app-logger',
        streams: [
            {
                level: "info",
                path: "logs/app.log"
            }
        ],
    }
const appLogger = bunyan.createLogger(options);
module.exports = appLogger;