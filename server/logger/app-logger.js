const bunyan = require("bunyan");
const appLogger = bunyan.createLogger({
    name: 'app-logger',
    streams: [
        {
            level: "info",
            path: "logs/app.log"
        }
    ],
});
module.exports = appLogger;