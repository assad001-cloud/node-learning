const express = require("express");
const router = express.Router();

// Route to check server status
router.get("/status", (req, res) => {
  try {
    res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get current server time
router.get("/time", (req, res) => {
  try {
    res.status(200).json({
      currentTime: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
