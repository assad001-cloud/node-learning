const logger = require('../utils/logger');
const { performance } = require('perf_hooks');
const os = require('os');

const monitoring = (req, res, next) => {
  const start = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${duration.toFixed(2)}ms`
    });

    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.originalUrl,
        duration
      });
    }
  });

  next();
};

const getSystemHealth = async () => {
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: process.uptime(),
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      available: `${Math.round(os.freemem() / 1024 / 1024)}MB`
    }
  };
};

module.exports = { monitoring, getSystemHealth };
