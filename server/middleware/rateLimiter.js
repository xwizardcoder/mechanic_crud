/**
 * Rate limiting middleware — prevents API abuse.
 * Simple in-memory implementation; in production use express-rate-limit + Redis.
 */

const requestCounts = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;    // per window per IP

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, windowStart: now });
    return next();
  }

  const entry = requestCounts.get(ip);

  // Reset window if expired
  if (now - entry.windowStart > WINDOW_MS) {
    requestCounts.set(ip, { count: 1, windowStart: now });
    return next();
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    console.warn(`[RateLimit] IP ${ip} exceeded ${MAX_REQUESTS} requests/min`);
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again in a minute.',
      retryAfter: Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 1000),
    });
  }

  next();
};

// Clean up old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts.entries()) {
    if (now - entry.windowStart > WINDOW_MS) {
      requestCounts.delete(ip);
    }
  }
}, 5 * 60 * 1000);

module.exports = { rateLimiter };
