const express = require("express");
const router = express.Router();

// Home page route
router.get("/", (req, res) => {
  try {
    res.status(200).send("Welcome to the Express Server ");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
