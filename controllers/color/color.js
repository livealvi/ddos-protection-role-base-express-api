const createError = require("http-errors");
const Color = require("../../models/color/color");

const colors = async (req, res, next) => {
  try {
    const colors = await Color.find({});
    if (colors === null || colors.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, colors });
  } catch (error) {
    return next(createError(error));
  }
};

module.exports = {
  colors,
};
