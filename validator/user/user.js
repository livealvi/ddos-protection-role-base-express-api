const { body } = require("express-validator");
const update = [
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("name can not be empty")
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
  body("role").notEmpty().withMessage("role can not be empty"),
  body("approve").isBoolean().withMessage("approve must be a boolean"),
  body("archive").isBoolean().withMessage("archive must be a boolean"),
];

const changePassword = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("enter old password")
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

const editRequest = [
  body("editRequest")
    .isBoolean()
    .withMessage("edit request approve must be a boolean"),
];

const addUser = [
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
  body("tag")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("tag can not be empty")
    .customSanitizer((value) => value.replaceAll(/\s/g, ""))
    .toLowerCase()
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
  body("autoApprove").isBoolean().withMessage("auto approve must be a boolean"),
];

module.exports = {
  update,
  changePassword,
  editRequest,
  addUser,
};
