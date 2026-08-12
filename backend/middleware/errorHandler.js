// Centralized Error Handling

class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error using pino/req.log if available, else console
  if (req.log) {
    req.log.error(err);
  } else {
    console.error(err);
  }

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production: don't leak error details
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  }
};

const { v4: uuidv4 } = require('uuid');
const pino = require('pino');
const pinoHttp = require('pino-http');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined,
});

const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers['x-request-id'] || uuidv4(),
  customProps: (req, res) => ({
    tenantId: req.tenantId,
    userId: req.user ? req.user.id : undefined,
  })
});

module.exports = {
  AppError,
  errorHandler,
  requestLogger,
  logger
};
