const createError = require("http-errors");
const Page = require("../../models/page/page");
const User = require("../../models/user/user");
const Tiles = require("../../models/tile/tile");
const PageRequest = require("../../models/page/pageRequest");
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
    let {
      title,
      description,
      url,
      logo,
      backgroundImage,
      icon,
      favIcon,
      createdBy,
    } = req.body;
    alreadyExist = await Page.findOne({ title: title });
    checkUser = await User.findOne({ _id: createdBy }).populate(
      "role",
      "name _id"
    );
    checkUserId = checkUser._id.toString();
    urlCheck = await Page.findOne({ url: url });
    if (urlCheck) {
      throw createError(400, "url is already taken");
    }

    let add = [];
    if (alreadyExist === null || alreadyExist.length == 0) {
      add = new Page({
        title: title,
        description: description,
        url: url,
        logo: logo,
        backgroundImage: backgroundImage,
        icon: icon,
        favIcon: favIcon,
        createdBy: createdBy,
        color: "#EB5757",
        approve: checkUser.autoApprove === true ? true : false,
        approveDate: checkUser.autoApprove === true ? Date.now() : null,
        assignTo:
          checkUser.role.name === "partner" && checkUserId === createdBy
            ? createdBy
            : null,
      });
    } else {
      return next(createError(400, "page is already exist"));
    }
    const page = await add.save();
    return res
      .status(201)
      .json({ success: 1, message: "Successfully, inserted" });
  } catch (error) {
    return next(createError(error));
  }
};

const pages = async (req, res, next) => {
  try {
    const pages = await Page.find({})
      .populate({
        path: "approvedBy",
        select: "name _id",
      })
      .populate({
        path: "assignTo",
        select: "name _id email",
        populate: {
          path: "badge",
        },
        populate: {
          path: "tag",
          select: "tag _id",
        },
      })
      .populate({
        path: "orders",
      });
    if (pages === null || pages.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, pages });
  } catch (error) {
    return next(createError(error));
  }
};

const publicPage = async (req, res, next) => {
  try {
    const pages = await Page.find({ approve: true })
      .populate({
        path: "approvedBy",
        select: "name _id",
      })
      .populate({
        path: "assignTo",
        select: "name _id",
        populate: {
          path: "badge",
        },
      })
      .populate({
        path: "orders",
      });
    if (pages === null || pages.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, pages });
  } catch (error) {
    return next(createError(error));
  }
};

const page = async (req, res, next) => {
  try {
    const id = req.params.id;
    const page = await Page.findById({ _id: id })
      .populate({
        path: "approvedBy",
        select: "name _id",
      })
      .populate({
        path: "assignTo",
        select: "name _id",
        populate: {
          path: "badge",
        },
      })
      .populate({
        path: "orders",
      });
    if (page === null || page.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, page });
  } catch (error) {
    return next(createError(error));
  }
};

const byURL = async (req, res, next) => {
  try {
    const url = req.params.url;
    const page = await Page.findOne({ url: url })
      .populate({
        path: "approvedBy",
        select: "name _id",
      })
      .populate({
        path: "assignTo",
        select: "name _id",
        populate: {
          path: "badge",
        },
      })
      .populate({
        path: "orders",
      });
    if (page === null || page.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, page });
  } catch (error) {
    return next(createError(error));
  }
};

const setColorForButton = async (req, res, next) => {
  try {
    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: 0,
        status: 400,
        message: errors.mapped(),
      });
    }
    const pageURL = req.params.url;
    let { color } = req.body;
    const findPage = await Page.findOne({ url: pageURL });
    if (findPage === null || findPage === undefined) {
      throw createError(400, "page dose not exits");
    }
    const updateColor = await Page.findOneAndUpdate(
      {
        url: pageURL,
      },
      {
        color: color,
        updatedAt: Date.now(),
      }
    );
    if (updateColor === null || updateColor.length == 0) {
      throw createError(400, "color not set");
    }
    return res
      .status(200)
      .json({ success: 1, message: "Successfully, updated" });
  } catch (error) {
    return next(createError(error));
  }
};

const orders = async (req, res, next) => {
  try {
    const id = req.params.id;
    let { orders } = req.body;
    alreadyExist = await Page.findById({ _id: id });

    if (alreadyExist) {
      const order = await Page.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          orders: orders,
          updatedAt: Date.now(),
        }
      );
      if (order === null || order.length == 0) {
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
    checkUrl = await Page.findOne({ url: url });
    if (checkUrl?._id.toString() === id && checkUrl.url === url) {
      const updateURL = await Page.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          url: url,
          editRequest: false,
          updatedAt: Date.now(),
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
      checkUrlAgain = await Page.findOne({ url: url });
      if (checkUrlAgain?.url === url) {
        throw createError(400, "url already taken");
      }
      const updateURL = await Page.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          url: url,
          editRequest: false,
          updatedAt: Date.now(),
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

const updateTitle = async (req, res, next) => {
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
    let { title } = req.body;
    checkUrl = await Page.findOne({ title: title });
    if (checkUrl?._id.toString() === id && checkUrl.title === title) {
      const updateTitle = await Page.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          title: title,
          editRequest: false,
          updatedAt: Date.now(),
        }
      );
      if (updateTitle === null || updateTitle.length == 0) {
        throw createError(404, "Error, updating");
      }
      return res.status(200).json({
        success: 1,
        message: "Successfully, updated",
      });
    } else {
      checkTitleAgain = await Page.findOne({ title: title });
      if (checkTitleAgain?.title === title) {
        throw createError(400, "title already taken");
      }
      const updateTitle = await Page.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          title: title,
          editRequest: false,
          updatedAt: Date.now(),
        }
      );
      if (updateTitle === null || updateTitle.length == 0) {
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

const adminAssignPages = async (req, res, next) => {
  try {
    const id = req.params.id;
    let { createdBy, assignTo } = req.body;
    const user = await User.findOne({
      _id: createdBy,
    }).populate("role", "name _id");
    if (user.role.name === "partner") {
      throw createError(404, "Error, updating");
    }
    const page = await Page.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        assignTo: assignTo,
        updatedAt: Date.now(),
      }
    );
    if (page === null || page.length == 0) {
      throw createError(404, "Error, updating");
    }
    return res.status(200).json({
      success: 1,
      message: "Successfully, updated",
    });
  } catch (error) {
    return next(createError(error));
  }
};

const approve = async (req, res, next) => {
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
    let { approve, approvedBy } = req.body;
    const user = await User.findOne({
      _id: approvedBy,
    }).populate("role", "name _id");
    if (user.role.name === "partner") {
      throw createError(404, "Error, updating");
    }
    const page = await Page.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        approve: approve,
        updatedAt: Date.now(),
      }
    );
    if (page === null || page.length == 0) {
      throw createError(404, "Error, updating");
    }
    return res.status(200).json({
      success: 1,
      message: "Successfully, updated",
    });
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
    let {
      description,
      logo,
      icon,
      favIcon,
      backgroundImage,
      approve,
      approvedBy,
      archive,
    } = req.body;
    alreadyExist = await Page.findById({ _id: id });

    if (alreadyExist._id.toString() === id) {
      const page = await Page.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          description: description,
          logo: logo,
          backgroundImage: backgroundImage,
          icon: icon,
          favIcon: favIcon,
          approve: approve === true ? true : false,
          approvedBy: approvedBy,
          approveDate: approve === true ? Date.now() : undefined,
          archive: archive,
          editRequest: false,
          archiveDate: archive === true ? Date.now() : undefined,
          updatedAt: Date.now(),
        }
      );
      if (page === null || page.length == 0) {
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

const pageRequestList = async (req, res, next) => {
  try {
    const requestList = await PageRequest.find({})
      .populate({
        path: "requestBy",
        select: "name _id email",
        populate: {
          path: "badge",
        },
      })
      .populate({
        path: "page",
      });

    if (requestList === null || requestList.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, requestList });
  } catch (error) {
    return next(createError(error));
  }
};

const pageRequestDelete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = await PageRequest.findByIdAndDelete({ _id: id });
    if (request === null || request.length == 0) {
      throw createError(404, "Error deleting");
    }
    return res
      .status(200)
      .json({ success: 1, message: "Successfully, deleted" });
  } catch (error) {
    return next(createError(error));
  }
};

const makePageEditRequest = async (req, res, next) => {
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
    const { page } = req.body;
    pageRequestMatch = await PageRequest.findOne({ requestBy: id });
    pageRequestUserID = pageRequestMatch?.requestBy?._id.toString();
    if (pageRequestUserID == id) {
      throw createError(404, "Error, already requested");
    }
    const add = await PageRequest({
      page: page,
      requestBy: id,
    });
    const pageRequest = await add.save();
    if (pageRequest === null || pageRequest.length == 0) {
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

const pageEditApprove = async (req, res, next) => {
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
    findPageRequest = await PageRequest.findById({ _id: id });
    const pageID = findPageRequest.page._id.toString();
    if (pageID && approve === true) {
      const page = await Page.findByIdAndUpdate(
        {
          _id: pageID,
        },
        {
          editRequest: true,
          updatedAt: Date.now(),
        }
      );
      if (page === null || page.length == 0) {
        throw createError(404, "Error, updating");
      }
      const pageRequest = await PageRequest.findByIdAndDelete({ _id: id });
      if (pageRequest === null || pageRequest.length == 0) {
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

const changeLogo = async (req, res, next) => {
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
    let { logo } = req.body;
    const page = await Page.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        logo: logo,
        updatedAt: Date.now(),
      }
    );
    if (page === null || page.length == 0) {
      throw createError(404, "Error, updating");
    }
    return res.status(200).json({
      success: 1,
      message: "Successfully, updated",
    });
  } catch (error) {
    return next(createError(error));
  }
};

const changeBackgroundImage = async (req, res, next) => {
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
    let { backgroundImage, createdBy } = req.body;
    const page = await Page.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        backgroundImage: backgroundImage,
        updatedAt: Date.now(),
      }
    );
    if (page === null || page.length == 0) {
      throw createError(404, "Error, updating");
    }
    return res.status(200).json({
      success: 1,
      message: "Successfully, updated",
    });
  } catch (error) {
    return next(createError(error));
  }
};

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    const findPage = await Page.findById({ _id: id });
    allTiles = findPage.orders;
    const removePageReq = await PageRequest.findOneAndDelete({ page: id });
    const tiles = await Tiles.deleteMany({ _id: allTiles });
    const page = await Page.findByIdAndDelete({ _id: id });
    if (page === null || page.length == 0) {
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
  pages,
  publicPage,
  page,
  orders,
  byURL,
  setColorForButton,
  updateURL,
  approve,
  changeLogo,
  changeBackgroundImage,
  adminAssignPages,
  updateTitle,
  update,
  pageRequestList,
  pageEditApprove,
  makePageEditRequest,
  pageRequestDelete,
  remove,
};
