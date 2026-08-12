const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// 1. Helmet Headers
exports.helmetMiddleware = helmet({
  contentSecurityPolicy: false, // Too restrictive for a CRM MVP, turn on if strictly required
  crossOriginEmbedderPolicy: false,
});

// 2. Global Rate Limiter
exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Strict Auth Limiter (for login, register, password reset)
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 auth requests per hour
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. API / Webhook Limiter
exports.apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500,
  message: {
    success: false,
    error: 'API rate limit exceeded',
  },
});
