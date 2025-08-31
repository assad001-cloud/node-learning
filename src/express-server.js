const express = require("express");
const app = express();
const port = 3000;

// bring in middleware
const logger = require("./middleware/logger");

// bring in routes
const apiRoutes = require("./routes/api");
const webRoutes = require("./routes/web");

// setup middleware
app.use(express.json({
  strict: true,
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      throw new Error("Malformed JSON");
    }
  }
})); // lets us read JSON from requests and handle malformed JSON
app.use(logger); // our own logger

// setup routes
app.use("/api", apiRoutes);
app.use("/", webRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.message === "Malformed JSON") {
    return res.status(400).json({ error: "Malformed JSON request" });
  }
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

// start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
