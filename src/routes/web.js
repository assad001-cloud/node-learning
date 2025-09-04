const express = require("express");
const router = express.Router();

// Homepage
router.get("/", (req, res) => {
  res.status(200).send("Welcome to my Express server!");
});

module.exports = router;
