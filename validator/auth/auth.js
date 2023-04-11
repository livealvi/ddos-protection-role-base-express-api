const { body } = require("express-validator");

const login = [
  body("email").notEmpty().withMessage("email can not be empty"),
  body("password").notEmpty().withMessage("password can not be empty"),
];

const signup = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name can not be empty")
    .trim()
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email can not be empty")
    .isEmail()
    .withMessage("must be an email")
    .normalizeEmail()
    .trim(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password can not be empty")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/)
    .withMessage(
      "enter a password at least 6 character and contain at least one uppercase. at least one lower case. at least one special character."
    )
    .trim(),
];

module.exports = {
  login,
  signup,
};
