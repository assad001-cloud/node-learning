// load express module
const express = require('express');
const app = express();

// take port from env or use 3000
const PORT = process.env.PORT || 3000;


// simple logging middleware
app.use(function (req, res, next) {
  console.log(req.method + " " + req.url);
  next();
});


// home route
app.get('/', function (req, res) {
  res.status(200).send('Welcome to my Express server');
});


// status route
app.get('/api/status', function (req, res) {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime()
  });
});


// time route
app.get('/api/time', function (req, res) {
  res.status(200).json({
    time: new Date().toISOString()
  });
});


// basic error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke' });
});


// start server
app.listen(PORT, function () {
  console.log("Server running on port " + PORT);
});
