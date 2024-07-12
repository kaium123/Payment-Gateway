class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true; // Operational errors are handled gracefully
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
      super(message, 404);
    }
  }
  
  class ValidationError extends AppError {
    constructor(message = 'Invalid input') {
      super(message, 400);
    }
  }
  
  class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
      super(message, 401);
    }
  }
  
  module.exports = {
    AppError,
    NotFoundError,
    ValidationError,
    UnauthorizedError
  };
  