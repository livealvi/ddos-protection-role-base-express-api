const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 60 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "too many login attempted. please, try again after an hour.",
});

const signupLimiter = rateLimit({
  windowMs: 120 * 60 * 1000, // 120 minutes
  max: 20, // Limit each IP to 20 requests per `window` (here, per 120 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "too many account created. please, try again after two hour.",
});

module.exports = {
  loginLimiter,
  signupLimiter,
};
