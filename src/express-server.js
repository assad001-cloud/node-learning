// Load environment variables
require("dotenv").config();

const express = require("express");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database"); // DB connection
const app = express();

// Connect to MongoDB before starting server
connectDB();

const PORT = process.env.PORT || 3000;


// Import middlewares and routes
const logger = require("./middleware/logger");
const apiRoutes = require("./routes/api");
const webRoutes = require("./routes/web");
const bookRoutes = require("./routes/books");


// Middleware
app.use(express.json());
app.use(logger);


// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/v1", limiter);


// Routes
app.use("/", webRoutes);
app.use("/api/v1", apiRoutes);
app.use("/api/v1/books", bookRoutes);


// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});


// Start the server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
