const { body } = require("express-validator");

const add = [
  body("tag")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("tag can not be empty")
    .customSanitizer((value) => value.replaceAll(/\s/g, ""))
    .toLowerCase()
    .trim(),
];

module.exports = {
  add,
};
