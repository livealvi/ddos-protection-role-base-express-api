const { body } = require("express-validator");

const add = [
  body("title")
    .isString()
    .notEmpty()
    .withMessage("title can not be empty")
    .isLength({ min: 6 })
    .withMessage("must be at least 6 chars long"),
  body("description").isString().trim(),
  body("logo")
    .isString()
    .notEmpty()
    .withMessage("logo url can not be empty")
    .trim(),
  body("backgroundImage")
    .isString()
    .withMessage("logo url can not be empty")
    .trim(),
  body("createdBy")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("createdBy can not be empty")
    .trim(),
  body("page")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("page can not be empty")
    .trim(),
  body("orders").trim(),
  body("buttonColor").isString().trim(),
  body("buttonTitle")
    .isString()
    .notEmpty()
    .withMessage("button title can not be empty")
    .trim(),
];

const adminAddTiles = [
  body("title")
    .isString()
    .notEmpty()
    .withMessage("title can not be empty")
    .isLength({ min: 6 })
    .withMessage("must be at least 6 chars long"),
  body("description").isString().trim(),
  body("logo")
    .isString()
    .notEmpty()
    .withMessage("logo url can not be empty")
    .trim(),
  body("backgroundImage")
    .isString()
    .withMessage("logo url can not be empty")
    .trim(),
  body("createdBy")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("createdBy can not be empty")
    .trim(),
  body("assignTo")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("assignTo can not be empty")
    .trim(),
  body("page")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("page can not be empty")
    .trim(),
  body("orders").trim(),
  body("buttonColor").isString().trim(),
  body("buttonTitle")
    .isString()
    .notEmpty()
    .withMessage("button title can not be empty")
    .trim(),
];

const update = [
  body("description")
    .isLength({ min: 35 })
    .withMessage("must be 6 chars long")
    .trim(),
  body("logo")
    .isString()
    .notEmpty()
    .withMessage("logo url can not be empty")
    .trim(),
  body("lock").isBoolean().withMessage("lock must be a boolean"),
  body("url")
    .isString()
    .optional({ nullable: true })
    .trim()
    .withMessage("url must be a string"),
  body("publicUrl")
    .isString()
    .optional({ nullable: true })
    .trim()
    .withMessage("publicUrl must be a string"),
  body("backgroundImage").isString().trim(),
  body("approvedBy")
    .isString()
    .notEmpty()
    .trim()
    .withMessage("approvedBy can not be empty"),
  body("approve").isBoolean().withMessage("approve must be a boolean"),
  body("archive").isBoolean().withMessage("archive must be a boolean"),
  body("buttonColor").trim(),
  body("buttonTitle")
    .isString()
    .notEmpty()
    .withMessage("button title can not be empty")
    .trim(),
];

module.exports = {
  add,
  update,
  adminAddTiles,
};
