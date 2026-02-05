import rateLimit from "express-rate-limit";

export const createRateLimiters = () => {
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many auth attempts from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  return { generalLimiter, authLimiter };
};

