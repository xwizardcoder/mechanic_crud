const xss = require('xss');

/**
 * Recursively sanitizes an object's string values against XSS attacks.
 * Strips all HTML tags and dangerous attributes.
 */
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return xss(value, {
      whiteList: {}, // No HTML tags allowed
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style'],
    });
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const sanitized = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        sanitized[key] = sanitizeValue(value[key]);
      }
    }
    return sanitized;
  }
  return value;
};

/**
 * Express middleware: sanitizes req.body against XSS before it reaches route handlers.
 */
const sanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  next();
};

module.exports = { sanitizeMiddleware, sanitizeValue };
