const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user/user");
const Page = require("../../models/page/page");
const TAG = require("../../models/tag/tag");
const errorFormatter = require("../../utils/validationErrorFormatter");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

const users = async (req, res, next) => {
  try {
    const users = await User.find({})
      .populate("role", "name _id")
      .populate("badge", "name _id")
      .populate("tag", "tag _id");
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
    const user = await User.findById({ _id: id })
      .populate("role", "name _id")
      .populate("badge", "name _id")
      .populate("tag", "tag _id");
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
      assignTo: userId,
    }).populate({
      path: "approvedBy",
      select: "name id",
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
    const tiles = await Page.find({
      assignTo: userId,
    })
      .populate({
        path: "orders",
      })
      .select("orders -_id");
    if (tiles === null || tiles.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, tiles });
  } catch (error) {
    return next(createError(error));
  }
};

const byURL = async (req, res, next) => {
  try {
    const url = req.params.url;
    const user = await User.findOne({ url: url })
      .populate("role", "name _id")
      .populate("badge", "name _id")
      .populate("tag", "tag _id");

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
    userMatch = await User.findById({ _id: id });
    if (userMatch === null || userMatch.length == 0) {
      return next(createError(404, "NO DATA FOUND"));
    }
    let lowerCase = tag.toLowerCase();
    let findTAG = await TAG.findOne({ tag: lowerCase });
    let tagAdded = [];
    if (findTAG === null || findTAG.length === 0) {
      const add = new TAG({
        tag: lowerCase,
      });
      tagAdded = await add.save();
    }
    const tagId = tagAdded?._id?.toString();
    const alreadyExistTagId = findTAG?._id?.toString();
    if (userMatch) {
      const updateTAG = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $push: { tag: [tagId == null ? alreadyExistTagId : tagId] },
          updatedAt: Date.now(),
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

const deleteTAG = async (req, res, next) => {
  try {
    const id = req.params.id;
    let { tag } = req.body;
    const deleteTAG = await User.findOneAndUpdate(
      { _id: id },
      {
        $pull: { tag: tag },
        updatedAt: Date.now(),
      }
    );
    if (deleteTAG === null || deleteTAG.length == 0) {
      throw createError(404, "Error deleting");
    }
    return res
      .status(200)
      .json({ success: 1, message: "Successfully, deleted" });
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

const userAddByAdmin = async (req, res, next) => {
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
    const checkAdmin = await User.findOne({
      _id: id,
    }).populate("role", "name _id");

    if (checkAdmin.role.name === "partner") {
      throw createError(400, "Error, insert");
    }
    const { name, email, password, autoApprove, tag } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const generatedURL = crypto.randomBytes(10).toString("hex");
    alreadyExist = await User.find({ email: email });
    if (alreadyExist.length != 0) {
      return next(createError(400, "user already exist"));
    }
    let lowerCase = tag.toLowerCase();
    let findTAG = await TAG.findOne({ tag: lowerCase });
    let tagAdded = [];
    if (findTAG === null || findTAG.length === 0) {
      const add = new TAG({
        tag: lowerCase,
      });
      tagAdded = await add.save();
    } else {
      return next(createError(400, "tag already exist"));
    }
    const tagId = tagAdded?._id.toString();
    const add = new User({
      name: name,
      email: email,
      password: hashedPassword,
      url: generatedURL,
      tag: tagId,
      autoApprove: autoApprove,
      role: "64231bf9f21deb779a148c64",
    });

    const user = await add.save();
    return res
      .status(201)
      .json({ success: 1, message: "Successfully, inserted" });
  } catch (error) {
    return next(createError(error));
  }
};

const autoApprove = async (req, res, next) => {
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
    const { autoApprove } = req.body;
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
          autoApprove: autoApprove,
          updatedAt: autoApprove == true ? Date.now() : Date.now(),
        }
      );
      if (user === null || user.length == 0) {
        throw createError(404, "Error, updating");
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

const editRequest = async (req, res, next) => {
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
    const { editRequest } = req.body;
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
          editRequest: editRequest,
        }
      );
      if (user === null || user.length == 0) {
        throw createError(404, "Error, updating");
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
  userAddByAdmin,
  updateURL,
  updateTAG,
  deleteTAG,
  changePassword,
  autoApprove,
  remove,
};
