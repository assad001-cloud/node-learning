const express = require("express");
const app = express();
const PORT = 3000;

// Import middlewares and routes
const logger = require("./middleware/logger"); // Custom logger middleware
const apiRoutes = require("./routes/api");      // API routes .
const webRoutes = require("./routes/web");      // Web routes (homepage)
const bookRoutes = require("./routes/books");   // Books API routes


// Middleware: Parse incoming JSON requests
app.use(express.json());


// Middleware: Log every request with method, URL, status, and response time
app.use(logger);


// Routes
app.use("/", webRoutes);       // Web homepage route
app.use("/api", apiRoutes);    // General API routes
app.use("/api/books", bookRoutes); // Books API routes


// Global error handler (catches errors from any route or middleware)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});


// Start server and listen on specified port
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
