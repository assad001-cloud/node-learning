const express = require("express");
const logger = require("./middleware/logger");
const webRoutes = require("./routes/web");
const apiRoutes = require("./routes/api");
const booksRoutes = require("./routes/books"); // import books API

const app = express();
const PORT = process.env.PORT || 3000;

// log requests
app.use(logger);

// parse json request body
app.use(express.json());

// add custom header
app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "NodeJS-Learning");
  next();
});

// web routes
app.use("/", webRoutes);

// api routes
app.use("/api", apiRoutes);

// books API routes
app.use("/api", booksRoutes);

// handle not found routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// handle server errors
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
