// In-memory rate limiter
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20;

const requestStore = new Map();

const rateLimiter = (req, res, next) => {
    // For simplicity, using IP for rate limiting
    const ip = req.ip || req.connection.remoteAddress;
    
    // In a real app, use a unique identifier or userId from req.body if it exists
    const key = req.body?.userId || ip;

    const now = Date.now();
    const entry = requestStore.get(key);

    if (!entry) {
        requestStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return next();
    }

    if (now > entry.resetTime) {
        requestStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return next();
    }

    if (entry.count >= MAX_REQUESTS) {
        return res.status(429).json({
            success: false,
            reply: "Rate limit exceeded. Please wait a minute before sending more messages."
        });
    }

    entry.count += 1;
    next();
};

module.exports = rateLimiter;
