// api routes
var express = require('express');
var router = express.Router();

// status route
router.get('/status', function (req, res) {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime()
  });
});

// time route
router.get('/time', function (req, res) {
  res.status(200).json({
    time: new Date().toISOString()
  });
});

module.exports = router;
