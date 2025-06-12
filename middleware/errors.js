class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

module.exports = { NotFoundError, ValidationError };
// This code defines custom error classes for handling specific types of errors in an Express application.

//global error handler middleware can be implemented in the main server file to catch these errors and send appropriate responses to the client. For example:
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred'
  });
};

module.exports = errorHandler;

//try/catch blocks can be used in route handlers to catch errors and pass them to the error handler
const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncWrapper;