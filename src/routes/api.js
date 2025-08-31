const express = require("express");
const router = express.Router();

// Status endpoint
router.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});

// Time endpoint
router.get("/time", (req, res) => {
  res.status(200).json({ time: new Date().toISOString() });
});

// Book routes
const booksRouter = require("./books");
router.use("/books", booksRouter);

module.exports = router;
