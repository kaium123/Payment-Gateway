const logger = require('../utils/logger');
const { AppError } = require('../utils/error');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred'
  });
};

module.exports = { errorHandler };
