// src/express-server.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/database"); // your existing DB connector
const logger = require("./utils/logger");

// routers
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users"); // keep if exists

const app = express();

// Security headers (CSP disabled for dev; configure for production)
app.use(helmet({ contentSecurityPolicy: false }));

// CORS - allow frontend origin set via env; allow cookies
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Common middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || "5", 10),
  message: { error: "Too many auth attempts, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api/v1/auth", authLimiter);
app.use("/api/v1", generalLimiter);

// Mount routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/users", userRoutes);

// Health endpoint
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Not found
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.message || "Server error", { stack: err.stack });
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Start server & DB (skip if test env; tests will import app directly and connect separately)
const PORT = parseInt(process.env.PORT || "3000", 10);
if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      logger.error("Failed DB connect", { message: err.message });
      process.exit(1);
    });
}

module.exports = app;
