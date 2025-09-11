
const express = require("express");
const app = express();


// Simple middleware to log every request (method + url)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // move to the next middleware or route
});



// Home route , shows welcome message
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Express Server ");
});



// Status route , returns if server is running and uptime in seconds
app.get("/api/status", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
  });
});



// Time route , returns current server time in ISO format
app.get("/api/time", (req, res) => {
  res.status(200).json({
    currentTime: new Date().toISOString(),
  });
});



// Error handling middleware ,  catches any server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});



// Start the server , runs on PORT 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
