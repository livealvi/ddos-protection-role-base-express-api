const router = require("express").Router();
const { loginLimiter, signupLimiter } = require("../../middleware/rateLimit");
const auth = require("../../controllers/auth/auth");
const { login, signup } = require("../../validator/auth/auth");

router.post("/signup", signupLimiter, signup, auth.signup);
router.post("/login", loginLimiter, login, auth.login);

module.exports = router;
