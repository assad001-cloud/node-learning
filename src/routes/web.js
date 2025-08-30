// web routes
var express = require('express');
var router = express.Router();

// home page
router.get('/', function (req, res) {
  res.status(200).send('Welcome to my Express server');
});

module.exports = router;
