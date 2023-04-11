const { body } = require("express-validator");

const add = [
  body("title")
    .isString()
    .trim()
    .isLength({ min: 6 })
    .withMessage("must be at least 6 chars long"),
  body("description").trim(),
  body("url")
    .isString()
    .notEmpty()
    .withMessage("url can not be empty")
    .customSanitizer((value) => value.replaceAll(/\s/g, ""))
    .toLowerCase()
    .trim(),
  body("logo").isString().trim(),
  body("icon").isString().optional({ nullable: true }).trim(),
  body("favIcon").optional({ nullable: true }).isString().trim(),
  body("backgroundImage").isString().trim(),
  body("createdBy")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("createdBy can not be empty")
    .trim(),
];

const update = [
  body("description").trim(),
  body("logo").isString().trim(),
  body("icon").isString().optional({ nullable: true }).trim(),
  body("favIcon").isString().optional({ nullable: true }).trim(),
  body("backgroundImage").isString(),
  body("approvedBy").isString().notEmpty().trim(),
  body("approve").isBoolean().withMessage("approve must be a boolean"),
  body("archive").isBoolean().withMessage("archive must be a boolean"),
];

const color = [body("color").isString().trim()];

module.exports = {
  add,
  update,
  color,
};
