require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
const logger = require("./middleware/logger");

// Routes
const apiRoutes = require("./routes/api");

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.RATE_LIMIT || 100,
  message: { error: "Too many requests, try again later" },
});
app.use(limiter);

// JSON parser & logger
app.use(express.json());
app.use(logger);

// Load books data from JSON file
const dataPath = path.join(__dirname, "books-data.json");
if (fs.existsSync(dataPath)) {
  global.books = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
} else {
  global.books = [];
}

// Routes with API versioning
app.use("/api/v1", apiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Save books on shutdown
const saveData = () => {
  fs.writeFileSync(dataPath, JSON.stringify(global.books, null, 2));
};
process.on("exit", saveData);
process.on("SIGINT", () => process.exit());

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
