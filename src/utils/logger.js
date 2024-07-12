const winston = require('winston');
const path = require('path');

const LOG_FILE_PATH = '/var/log/my-app.log';

const options = {
  file: {
    level: 'info',
    filename: LOG_FILE_PATH,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
    timestamp: true
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
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

function traceCaller(n) {
  if (isNaN(n) || n < 0) n = 1;
  const stack = (new Error()).stack;
  const stackLines = stack.split('\n');

  // Skip the first line which is the current location
  const stackLine = stackLines[n + 1] || ''; 

  // Extract file path and line number from the stack line
  const match = stackLine.match(/\(([^)]+)\)/);
  if (match) {
    return match[1]; 
  }

  return 'Unknown location';
}


// Wrap logger methods to include file and line number
['info', 'error'].forEach((level) => {
  const originalMethod = logger[level];
  
  logger[level] = function (msg, meta) {
    const fileAndLine = traceCaller(2); // Get the file and line number
    let formattedMessage;

    // Check if meta is an instance of Error
    if (meta instanceof Error) {
      formattedMessage = `file : ${fileAndLine}, msg : ${msg} | Error: ${meta.message} | Stack: ${meta.stack}`;
    } 
    // Check if meta is an object (not an instance of Error)
    else if (meta && typeof meta === 'object') {
      formattedMessage = `file : ${fileAndLine}, msg : ${msg} | Meta: ${JSON.stringify(meta)}`;

    } 
    // Default case: meta is neither an Error nor an object
    else {
      formattedMessage = `file : ${fileAndLine}, msg : ${msg}`;

    }

    // Call the original logging method with the formatted message
    return originalMethod.call(this, formattedMessage);
  };
});


logger.stream = {
  write: function (message) {
    logger.info(message.trim()); // `.trim()` to remove extra newlines
  }
};

// Export the logger
module.exports = logger;
