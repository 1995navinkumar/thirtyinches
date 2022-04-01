const bunyan = require("bunyan");

const notificationLogger = bunyan.createLogger({ name: "push-notification-logger" });

module.exports = notificationLogger;