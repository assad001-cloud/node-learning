// load express
var express = require('express');
var app = express();

// load custom logger
var logger = require('./middleware/logger');

// load routes
var apiRoutes = require('./routes/api');
var webRoutes = require('./routes/web');

// take port from env or 3000
var PORT = process.env.PORT || 3000;

// use json parser
app.use(express.json());

// use logger middleware
app.use(logger);

// add custom header for all response
app.use(function (req, res, next) {
  res.setHeader('X-Powered-By', 'NodeJS-Learning');
  next();
});

// use routes
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke' });
});

// start server
app.listen(PORT, function () {
  console.log("Server running on port " + PORT);
});
