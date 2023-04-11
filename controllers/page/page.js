const createError = require("http-errors");
const Page = require("../../models/page/page");
const errorFormatter = require("../../utils/validationErrorFormatter");
const { validationResult, check } = require("express-validator");

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
        select: "name",
      })
      .populate({
        path: "createdBy",
        select: "name",
      })
      .populate({
        path: "orders",
        options: { sort: { _id: -1 } },
      });
    if (pages === null || pages.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, pages });
  } catch (error) {
    return next(createError(error));
  }
};

const pagesForSearch = async (req, res, next) => {
  try {
    const pages = await Page.find({ approve: true })
      .select(
        "title url description approve archive icon favIcon logo color backgroundImage"
      )
      .populate({
        path: "orders",
        select:
          "title url description logo backgroundImage buttonColor buttonTitle",
        options: { sort: { _id: -1 } },
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
        select: "name",
      })
      .populate({
        path: "createdBy",
        select: "name",
      })
      .populate({
        path: "orders",
        options: { sort: { _id: -1 } },
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
        select: "name",
      })
      .populate({
        path: "createdBy",
        select: "name",
      })
      .populate({
        path: "orders",
        options: { sort: { _id: -1 } },
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
          approve: approve,
          approvedBy: approvedBy,
          approveDate: approve === true ? Date.now() : undefined,
          archive: archive,
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

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;
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
  pagesForSearch,
  page,
  orders,
  byURL,
  setColorForButton,
  updateURL,
  updateTitle,
  update,
  remove,
};
