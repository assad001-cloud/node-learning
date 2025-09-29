// src/middleware/errorHandler.js
const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  const correlationId = req.correlationId || req.headers["x-correlation-id"] || null;
  const status = err.status || err.statusCode || 500;
  const payload = {
    error: true,
    code: err.code || (status >= 500 ? "INTERNAL_ERROR" : "ERROR"),
    message: err.message || "Internal Server Error",
    correlationId
  };

  // add details for validation errors
  if (err.name === "ValidationError" && err.errors) {
    payload.details = Object.values(err.errors).map((e) => e.message);
    payload.code = "VALIDATION_ERROR";
  } else if (err.code === 11000) {
    payload.code = "DUPLICATE_KEY";
    payload.details = err.keyValue || {};
  }

  logger.log({ level: status >= 500 ? "error" : "warn", message: err.message, correlationId, stack: err.stack || "" });

  res.status(status).json(payload);
};
