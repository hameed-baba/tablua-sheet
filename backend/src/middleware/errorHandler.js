const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    const message = err.errors.map((error) => error.message).join(", ");
    error = {
      statusCode: 400,
      message: `Validation Error: ${message}`,
    };
  }

  // Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    const message = "Duplicate field value entered";
    error = {
      statusCode: 400,
      message,
    };
  }

  // Sequelize foreign key constraint error
  if (err.name === "SequelizeForeignKeyConstraintError") {
    const message = "Invalid reference to related record";
    error = {
      statusCode: 400,
      message,
    };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = {
      statusCode: 401,
      message,
    };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = {
      statusCode: 401,
      message,
    };
  }

  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err }),
  });
};

/**
 * Handle 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  error.code = "ROUTE_NOT_FOUND";
  next(error);
};

/**
 * Async error handler wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
};
