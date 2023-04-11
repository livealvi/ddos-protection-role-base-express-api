const { body } = require("express-validator");

const url = [
  body("url")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("url can not be empty")
    .customSanitizer((value) => value.replaceAll(/\s/g, ""))
    .toLowerCase()
    .trim(),
];

const tag = [
  body("tag")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("tag can not be empty")
    .isString()
    .customSanitizer((value) => value.replaceAll(/\s/g, ""))
    .toLowerCase(),
];

const title = [
  body("title")
    .isString()
    .notEmpty()
    .withMessage("title can not be empty")
    .trim()
    .isLength({ min: 6 })
    .withMessage("must be at least 6 chars long"),
];

module.exports = {
  url,
  tag,
  title,
};
