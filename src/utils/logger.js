const winston = require('winston');
const path = require('path');
const appRoot = require('app-root-path');

const PROJECT_ROOT = path.join(__dirname, '..');

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    timestamp: true
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false, // Use 'false' for console logs
    colorize: true,
    timestamp: true
  }
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

// Function to get the caller file and line number
function traceCaller(n) {
  if (isNaN(n) || n < 0) n = 1;
  n += 1;
  const stack = (new Error()).stack;
  let stackLines = stack.split('\n');
  
  // Skip the first line which is the current location
  let stackLine = stackLines[n];
  
  if (stackLine) {
    // Extract file path and line number from the stack line
    let match = stackLine.match(/\(([^)]+)\)/);
    if (match) {
      return match[1]; // Returns the file path and line number
    }
  }
  
  return 'Unknown location';
}

// Wrap logger methods to include file and line number
['info', 'error'].forEach((level) => {
  const originalMethod = logger[level];
  logger[level] = function (msg, meta) {
    const fileAndLine = traceCaller(1);
    const message = meta instanceof Error
      ? `${fileAndLine}: ${msg} | Error: ${meta.message} | Stack: ${meta.stack}`
      : meta && typeof meta === 'object'
        ? `${fileAndLine}: ${msg} | Meta: ${JSON.stringify(meta)}`
        : `${fileAndLine}: ${msg}`;
    return originalMethod.call(this, message);
  };
});

logger.stream = {
  write: function (message) {
    logger.info(message.trim()); // `.trim()` to remove extra newlines
  }
};

// Export the logger
module.exports = logger;
