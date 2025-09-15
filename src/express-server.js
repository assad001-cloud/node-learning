const express = require("express");
const logger = require("./middleware/logger");
const webRoutes = require("./routes/web");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

// Use custom logger
app.use(logger);

// Parse json request body
app.use(express.json());

// Add custom header
app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "NodeJS-Learning");
  next();
});

// Use web routes
app.use("/", webRoutes);

// Use api routes
app.use("/api", apiRoutes);

// Handle routes that do not exist
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Handle server errors
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
