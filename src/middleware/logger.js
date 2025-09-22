// This middleware logs method, url, status and response time
const winston = require("winston");


// Configure winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // logs in structured JSON for better readability
  ),
  transports: [
    new winston.transports.Console(), // log to console
    new winston.transports.File({ filename: "logs/app.log" }) // also save logs to file
  ],
});

module.exports = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  next();
};
