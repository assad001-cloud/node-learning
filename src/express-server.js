// src/express-server.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/database");
const logger = require("./utils/logger");
const requestLogger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const bookRoutes = require("./routes/books");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Version header middleware
app.use((req, res, next) => {
  res.setHeader("X-API-Version", "v1");
  next();
});

// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(requestLogger); // structured request logging

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MIN || "60", 10) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || "5", 10),
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api/v1", generalLimiter);
app.use("/api/v1/auth", authLimiter);

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1", apiRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: true, code: "NOT_FOUND", message: "Endpoint not found" }));

// global error handler
app.use(errorHandler);

// connect db & start if not testing
if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      logger.info("Database connected (server start)");
      app.listen(PORT, () => {
        logger.info(`Server started on http://localhost:${PORT}`);
        // eslint-disable-next-line no-console
        console.log(`Server started on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      logger.error("Failed to connect DB on server start", { message: err.message, stack: err.stack });
      process.exit(1);
    });
}

module.exports = app;
