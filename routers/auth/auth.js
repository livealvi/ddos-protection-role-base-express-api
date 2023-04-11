const router = require("express").Router();
const auth = require("../../controllers/auth/auth");
const { login, signup } = require("../../validator/auth/auth");

router.post("/signup", signup, auth.signup);
router.post("/login", login, auth.login);

module.exports = router;
