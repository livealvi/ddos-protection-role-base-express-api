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
    .customSanitizer((value) => value.replaceAll(/\s/g, ""))
    .toLowerCase()
    .trim(),
];

const logo = [body("logo").isString().trim()];

const backgroundImage = [body("backgroundImage").isString().trim()];

const autoApprove = [
  body("autoApprove").isBoolean().withMessage("auto approve must be a boolean"),
];
const lock = [body("lock").isBoolean().withMessage("lock must be a boolean")];

const approve = [
  body("approve").isBoolean().withMessage("approve must be a boolean"),
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

const badgeRequest = [
  body("badge")
    .notEmpty()
    .withMessage("badge can not be must be empty")
    .isString()
    .trim(),
];

const pageRequest = [
  body("page")
    .notEmpty()
    .withMessage("page can not be must be empty")
    .isString()
    .trim(),
];

module.exports = {
  url,
  tag,
  title,
  autoApprove,
  approve,
  logo,
  lock,
  backgroundImage,
  pageRequest,
  badgeRequest,
};
