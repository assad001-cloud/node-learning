// src/express-server.js
require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("./utils/logger");
const mongoose = require("./config/database");

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/books", require("./routes/books"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1", require("./routes/api"));
app.use("/", require("./routes/web"));

// Error handler
app.use(require("./middleware/errorHandler"));

// Start server only if NOT in test environment
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}

module.exports = app; // export app for tests
