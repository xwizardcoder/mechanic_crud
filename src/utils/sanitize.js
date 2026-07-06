import xss from 'xss';

const XSS_OPTIONS = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object'],
};

/**
 * Sanitize a single string value against XSS
 */
export const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return xss(value.trim(), XSS_OPTIONS);
};

/**
 * Sanitize all string fields of an object
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sanitized[key] = typeof obj[key] === 'string' ? sanitizeString(obj[key]) : obj[key];
    }
  }
  return sanitized;
};
