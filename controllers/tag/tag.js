const createError = require("http-errors");
const TAG = require("../../models/tag/tag");
const User = require("../../models/user/user");
const errorFormatter = require("../../utils/validationErrorFormatter");
const { validationResult } = require("express-validator");

const add = async (req, res, next) => {
  try {
    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: 0,
        status: 400,
        message: errors.mapped(),
      });
    }
    let { tag } = req.body;
    let lowerCase = tag.toLowerCase();
    let alreadyExist = await TAG.findOne({ tag: lowerCase });
    if (alreadyExist === null || alreadyExist === undefined) {
      const add = new TAG({
        tag: lowerCase,
      });
      const tagAdded = await add.save();
      return res.status(201).json({
        success: 1,
        message: "Successfully, inserted",
      });
    } else {
      return next(createError(400, "tag is already exist"));
    }
  } catch (error) {
    return next(createError(error));
  }
};

const tags = async (req, res, next) => {
  try {
    const tags = await TAG.find({});
    if (tags === null || tags.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, tags });
  } catch (error) {
    return next(createError(error));
  }
};

const tag = async (req, res, next) => {
  try {
    const id = req.params.id;
    const tag = await TAG.findById({ _id: id });
    if (tag === null || tag.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, tag });
  } catch (error) {
    return next(createError(error));
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    let { tag } = req.body;
    let lowerCase = tag.toLowerCase();
    const alreadyExist = await TAG.findOne({
      tag: lowerCase,
    });
    if (alreadyExist?.tag === lowerCase) {
      return next(createError(400, "tag already exist"));
    }
    const update = await TAG.findByIdAndUpdate(
      { _id: id },
      {
        tag: lowerCase,
      }
    );
    if (update === null || update.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res
      .status(200)
      .json({ success: 1, message: "Successfully, updated" });
  } catch (error) {
    return next(createError(error));
  }
};

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    const tag = await TAG.findByIdAndDelete({ _id: id });
    if (tag === null || tag.length == 0) {
      throw createError(404, "Error deleting");
    }
    return res
      .status(200)
      .json({ success: 1, message: "Successfully, deleted" });
  } catch (error) {
    return next(createError(error));
  }
};

module.exports = {
  add,
  tags,
  tag,
  update,
  remove,
};
