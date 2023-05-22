const createError = require("http-errors");
const Badge = require("../../models/badge/badge");
const User = require("../../models/user/user");
const BadgeRequest = require("../../models/badge/badgeRequest");
const errorFormatter = require("../../utils/validationErrorFormatter");
const { validationResult } = require("express-validator");

const badges = async (req, res, next) => {
  try {
    const badges = await Badge.find({});
    if (badges === null || badges.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, badges });
  } catch (error) {
    return next(createError(error));
  }
};

const listOfBadgeRequest = async (req, res, next) => {
  try {
    const badgeRequest = await BadgeRequest.find({})
      .populate({
        path: "requestBy",
        select: "name _id email",
        populate: {
          path: "badge",
          select: "name _id",
        },
      })
      .populate({
        path: "badge",
      });
    if (badgeRequest === null || badgeRequest.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, badgeRequest });
  } catch (error) {
    return next(createError(error));
  }
};

const makeBadgeRequest = async (req, res, next) => {
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
    const { badge } = req.body;
    badgeMatch = await BadgeRequest.findOne({ requestBy: id });

    badgeRequestUserID = badgeMatch?.requestBy._id.toString();

    if (badgeRequestUserID == id) {
      throw createError(404, "Error, already requested");
    }

    const add = await BadgeRequest({
      badge: badge,
      requestBy: id,
    });

    const badgeRequest = await add.save();
    if (badgeRequest === null || badgeRequest.length == 0) {
      throw createError(404, "Error, insert");
    }
    return res.status(201).json({
      success: 1,
      message: "Successfully, inserted",
    });
  } catch (error) {
    return next(createError(error));
  }
};

const badgeApprove = async (req, res, next) => {
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
    const { approve } = req.body;
    findBadgeRequest = await BadgeRequest.findById({ _id: id });
    if (findBadgeRequest === null || findBadgeRequest.length == 0) {
      return next(createError(404, "NO DATA FOUND"));
    }
    const badgeID = findBadgeRequest.badge._id.toString();
    const userID = findBadgeRequest.requestBy._id.toString();
    userMatch = await User.findById({ _id: userID });
    if (userMatch === null || userMatch.length == 0) {
      return next(createError(404, "NO DATA FOUND"));
    }
    if (userMatch && approve === true) {
      const user = await User.findByIdAndUpdate(
        {
          _id: userID,
        },
        {
          badge: badgeID,
          updatedAt: Date.now(),
        }
      );
      if (user === null || user.length == 0) {
        throw createError(404, "Error, updating");
      }
      const badgeRequest = await BadgeRequest.findByIdAndDelete({ _id: id });
      if (badgeRequest === null || badgeRequest.length == 0) {
        throw createError(404, "Error deleting");
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

const adminChangeBadge = async (req, res, next) => {
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
    const { badge } = req.body;

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
          badge: badge,
          updatedAt: Date.now(),
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

module.exports = {
  badges,
  listOfBadgeRequest,
  badgeApprove,
  makeBadgeRequest,
  adminChangeBadge,
};
