// src/express-server.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database"); // if you export this earlier; else require DB file for immediate connect
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

// Security middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Basic middlewares
app.use(express.json());
app.use(cookieParser());

// Connect DB on startup for non-test env
if (process.env.NODE_ENV !== "test") {
  // If your config exports connectDB, use it; otherwise requiring the DB file initiates connection
  try {
    // if you exported connectDB earlier:
    if (typeof connectDB === "function") {
      connectDB().then(() => logger.info("Database connected on server startup")).catch(err => {
        logger.error("DB connect error", { message: err.message });
        process.exit(1);
      });
    } else {
      // older pattern: require side-effectful DB file
      require("./config/database");
    }
  } catch (err) {
    logger.error("DB connection attempt failed", { message: err.message });
    process.exit(1);
  }
}

// Routes (mount auth before protected resources)
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/books", require("./routes/books"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1", require("./routes/api"));
app.use("/", require("./routes/web"));

// Error handling middleware (your existing one)
app.use(require("./middleware/errorHandler"));

// Start server only when not testing (tests import app)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
