import rateLimit from "express-rate-limit";

/**
 * Rate limiters for sensitive API endpoints.
 * Limits are generous enough for normal users but protect against automated abuse.
 */

// AI-powered endpoints: resume analysis + question generation
// These are expensive (LLM calls + credit consumption), so tighter limits
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1-minute window
  max: 10, // 10 AI requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many AI requests. Please wait a moment and try again." },
});

// Answer submission: called per question during an interview
// More generous since a 5-question interview submits rapidly
export const answerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30, // 30 submissions per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions. Please slow down." },
});

// Payment order creation: should be very rare per user
export const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5-minute window
  max: 5, // 5 payment attempts per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many payment attempts. Please wait before trying again." },
});

// General auth endpoint protection
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 20, // 20 auth attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." },
});
