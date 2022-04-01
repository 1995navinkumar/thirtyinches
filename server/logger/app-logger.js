const bunyan = require("bunyan");

const appLogger = bunyan.createLogger({ name: "app-logger" });

module.exports = appLogger;