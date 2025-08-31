const express = require("express");
const router = express.Router();

// check server status
router.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});

// get current server time
router.get("/time", (req, res) => {
  res.status(200).json({
    time: new Date().toISOString(),
  });
});

// attach book routes
const booksRouter = require("./books");
router.use("/books", booksRouter);

module.exports = router;
