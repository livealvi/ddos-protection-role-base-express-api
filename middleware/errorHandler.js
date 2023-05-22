const createError = require("http-errors");
// 404 not found
function notFoundHandler(req, res, next) {
  next(createError(404, "Your requested content was not found!"));
}
// error occur
function errorOccurHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  createError(statusCode, err.message);
  res.status(statusCode).json({
    success: 0,
    message: err.message,
    //stack: err.stack,
  });
}

module.exports = {
  notFoundHandler,
  errorOccurHandler,
};
