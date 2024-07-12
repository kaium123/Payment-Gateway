function AppError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isAppError = true; 
    Error.captureStackTrace(error, AppError);
    return error;
  }
  
  function NotFoundError(message = 'Resource not found') {
    return AppError(message, 404);
  }
  
  function ValidationError(message = 'Invalid input') {
    return AppError(message, 400);
  }
  
  function UnauthorizedError(message = 'Unauthorized') {
    return AppError(message, 401);
  }
  
  module.exports = {
    AppError,
    NotFoundError,
    ValidationError,
    UnauthorizedError
  };
  