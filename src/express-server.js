// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const rateLimit = require("express-rate-limit"); // for rate limiting
const app = express();

// PORT from .env or fallback to 3000
const PORT = process.env.PORT || 3000;

// Import middlewares and routes
const logger = require("./middleware/logger"); // custom logger
const apiRoutes = require("./routes/api");      // general API routes
const webRoutes = require("./routes/web");      // homepage
const bookRoutes = require("./routes/books");   // Books API routes

// Middleware: parse JSON request body
app.use(express.json());

// Middleware: log every request
app.use(logger);

// Rate limiting: max 100 requests per hour per IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/v1", limiter); // apply to all v1 API routes

// Routes
app.use("/", webRoutes);                 // homepage
app.use("/api/v1", apiRoutes);          // general API routes with versioning
app.use("/api/v1/books", bookRoutes);   // books routes with versioning

// Global error handler for uncaught errors
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
