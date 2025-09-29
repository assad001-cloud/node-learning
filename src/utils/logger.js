const { createLogger, format, transports } = require('winston');
const { v4: uuidv4 } = require('uuid');

const requestId = () => uuidv4();

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(info => {
      return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message} ${
        info.requestId ? `(reqId: ${info.requestId})` : ''
      }`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/app.log' })
  ]
});

module.exports = logger;
module.exports.requestId = requestId;
