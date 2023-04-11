const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user/user");
const Page = require("../../models/page/page");
const Tile = require("../../models/tile/tile");
const errorFormatter = require("../../utils/validationErrorFormatter");
const { validationResult } = require("express-validator");

const users = async (req, res, next) => {
  try {
    const users = await User.find({}).populate("role", "name _id");
    if (users === null || users.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, users });
  } catch (error) {
    return next(createError(error));
  }
};

const user = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById({ _id: id }).populate("role", "name _id");
    if (user === null || user.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, user });
  } catch (error) {
    return next(createError(error));
  }
};

const userHasManyPages = async (req, res, next) => {
  try {
    let url = req.params.url;
    const user = await User.findOne({
      url: url,
    });
    const userId = user._id.toString();
    const pages = await Page.find({
      createdBy: userId,
    }).populate({
      path: "approvedBy",
      select: "name",
    });
    if (pages === null || pages.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, pages });
  } catch (error) {
    return next(createError(error));
  }
};

const userHasManyTiles = async (req, res, next) => {
  try {
    let url = req.params.url;
    const user = await User.findOne({
      url: url,
    });
    const userId = user._id.toString();
    const pages = await Tile.find({
      createdBy: userId,
    }).populate({
      path: "approvedBy",
      select: "name",
    });
    if (pages === null || pages.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, pages });
  } catch (error) {
    return next(createError(error));
  }
};

const byURL = async (req, res, next) => {
  try {
    const url = req.params.url;
    const user = await User.findOne({ url: url });

    if (user === null || user.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, user });
  } catch (error) {
    return next(createError(error));
  }
};

const updateURL = async (req, res, next) => {
  try {
    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: 0,
        status: 400,
        message: errors.mapped(),
      });
    }
    const id = req.params.id;
    let { url } = req.body;
    checkUrl = await User.findOne({ url: url });
    if (checkUrl?._id.toString() === id && checkUrl.url === url) {
      const updateURL = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          url: url,
        }
      );
      if (updateURL === null || updateURL.length == 0) {
        throw createError(404, "Error, updating");
      }
      return res.status(200).json({
        success: 1,
        message: "Successfully, updated",
      });
    } else {
      checkUrlAgain = await User.findOne({ url: url });
      if (checkUrlAgain?.url === url) {
        throw createError(400, "url already taken");
      }
      const updateURL = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          url: url,
        }
      );
      if (updateURL === null || updateURL.length == 0) {
        throw createError(400, "Error, updating");
      }
      return res.status(200).json({
        success: 1,
        message: "Successfully, updated",
      });
    }
  } catch (error) {
    return next(createError(error));
  }
};

const updateTAG = async (req, res, next) => {
  try {
    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: 0,
        status: 400,
        message: errors.mapped(),
      });
    }
    const id = req.params.id;
    let { tag } = req.body;
    checkTAG = await User.findOne({ tag: tag });
    if (checkTAG?._id.toString() === id && checkTAG.tag === tag) {
      const updateTAG = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          tag: tag,
        }
      );
      if (updateTAG === null || updateTAG.length == 0) {
        throw createError(404, "Error, updating");
      }
      return res.status(200).json({
        success: 1,
        message: "Successfully, updated",
      });
    } else {
      checkTAGAgain = await User.findOne({ tag: tag });
      if (checkTAGAgain?.tag === tag) {
        throw createError(400, "tag already taken");
      }
      const updateTAG = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          tag: tag,
        }
      );
      if (updateTAG === null || updateTAG.length == 0) {
        throw createError(400, "Error, updating");
      }
      return res.status(200).json({
        success: 1,
        message: "Successfully, updated",
      });
    }
  } catch (error) {
    return next(createError(error));
  }
};

const update = async (req, res, next) => {
  try {
    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: 0,
        status: 400,
        message: errors.mapped(),
      });
    }
    const id = req.params.id;
    const { name, email, role, approve, archive } = req.body;
    userMatch = await User.findById({ _id: id });
    if (userMatch === null || userMatch.length == 0) {
      return next(createError(404, "NO DATA FOUND"));
    }
    if (userMatch) {
      const user = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          name: name,
          email: email,
          role: role,
          approve: approve,
          approveDate: approve == true ? Date.now() : undefined,
          archive: archive,
          archiveDate: archive == true ? Date.now() : undefined,
          updatedAt: Date.now(),
        }
      );
      if (user === null || user.length == 0) {
        throw createError(404, "Error, updating");
      }
      const access_token = jwt.sign(
        {
          name: userMatch.name,
          email: userMatch.email,
          id: userMatch._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "84600s",
        }
      );

      return res.status(200).json({
        success: 1,
        message: "Successfully, updated",
        access_token: access_token,
      });
    }
  } catch (error) {
    return next(createError(error));
  }
};

const changePassword = async (req, res, next) => {
  try {
    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: 0,
        status: 400,
        message: errors.mapped(),
      });
    }
    const id = req.params.id;
    const { oldPassword, password } = req.body;
    userMatch = await User.findById({ _id: id });
    if (userMatch === null || userMatch.length == 0) {
      return next(createError(404, "NO DATA FOUND"));
    }
    if (!password) {
      return next(createError(401, "please provide new password"));
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    if (userMatch === null || (userMatch.length == 0 && !oldPassword)) {
      return next(createError(401, "please provide valid credential 1"));
    }
    const isValidPassword = await bcrypt.compare(
      oldPassword,
      userMatch.password
    );
    if (!isValidPassword) {
      return next(createError(401, "old password not match"));
    }
    if (isValidPassword) {
      const user = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          password: hashedPassword,
        }
      );
      if (user === null || user.length == 0) {
        throw createError(404, "Error, updating");
      }
      const access_token = jwt.sign(
        {
          name: userMatch.name,
          email: userMatch.email,
          id: userMatch._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "84600s",
        }
      );
      return res.status(200).json({
        success: 1,
        message: "Successfully, updated password",
        access_token: access_token,
      });
    }
  } catch (error) {
    return next(createError(error));
  }
};

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete({ _id: id });
    if (user === null || users.length == 0) {
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
  users,
  user,
  byURL,
  userHasManyPages,
  userHasManyTiles,
  update,
  updateURL,
  updateTAG,
  changePassword,
  remove,
};
