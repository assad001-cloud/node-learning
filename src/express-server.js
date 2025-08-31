const express = require("express");
const app = express();
const port = 3000;

// bring in middleware
const logger = require("./middleware/logger");

// bring in routes
const apiRoutes = require("./routes/api");
const webRoutes = require("./routes/web");

// setup middleware
app.use(express.json()); // lets us read JSON from requests
app.use(logger);         // our own logger

// setup routes
app.use("/api", apiRoutes);  // anything starting with /api
app.use("/", webRoutes);     // homepage etc.

// start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
