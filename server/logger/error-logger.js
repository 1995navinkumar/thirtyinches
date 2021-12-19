const bunyan = require("bunyan");

const  getFullStack = function getFullStack(err) {
  var ret = err.stack || err.toString(),
    cause;

  if (typeof err.cause === 'function') {
    cause = err.cause();
    if (cause) {
      ret += '\nCaused by: ' +
        getFullStack(cause);
    }
  }
  return ret;
};
const log = bunyan.createLogger({
  name: "errorLog",
  serializers: {
    err: function errSerializer(err) {
      // check for undefined/null and of expected type
      if (!err || !err.stack) {
        return err;
      }

      return {
          message: err.message,
          name: err.name,
          stack: getFullStack(err),
          code: err.code,
          signal: err.signal,
          requestId: err.requestId,
          statusCode: err.statusCode
      };
    }
  }
});

/**
 * Express middleware to log Error objects which is passed to a ErrorHandler
 * Adds requestId to err 
 * Logs Error()
 */
module.exports = function errorLogger(err, req, res, next) {
  err.requestId = req && req.requestId;

  log.error({err: err});
  next(err);
}



