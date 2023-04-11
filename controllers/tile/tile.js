const createError = require("http-errors");
const Tile = require("../../models/tile/tile");
const Page = require("../../models/page/page");
const { v4: uuidv4 } = require("uuid");
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
      logo,
      backgroundImage,
      createdBy,
      page,
      buttonColor,
      buttonTitle,
    } = req.body;
    checkPage = await Page.findOne({ _id: page });
    if (checkPage === null || checkPage.length === 0) {
      throw createError(400, "the page is dose not exist");
    }
    pageBelongToPartner = await Page.findOne({ createdBy: createdBy });
    if (pageBelongToPartner === null) {
      throw createError(400, "this page is not belong to this partner");
    }
    let add = new Tile({
      title: title,
      description: description,
      url: uuidv4(),
      logo: logo,
      page: page,
      backgroundImage: backgroundImage,
      buttonColor: buttonColor,
      buttonTitle: buttonTitle,
      createdBy: createdBy,
      buttonDisable: true,
    });

    let tile = await add.save();
    tilesId = tile._id.toString();
    const addToOrder = await Page.updateOne(
      {
        _id: page,
      },
      {
        $push: { orders: [tilesId] },
        updatedAt: Date.now(),
      }
    );
    return res.status(201).json({
      success: 1,
      message: "Successfully, inserted",
    });
  } catch (error) {
    return next(createError(error));
  }
};

const tiles = async (req, res, next) => {
  try {
    const tiles = await Tile.find({})
      .populate({
        path: "approvedBy",
        select: "name",
      })
      .populate({
        path: "createdBy",
        select: "name",
      })
      .populate({
        path: "page",
        select: "title",
      });
    if (tiles === null || tiles.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, tiles });
  } catch (error) {
    return next(createError(error));
  }
};

const tile = async (req, res, next) => {
  try {
    const id = req.params.id;
    const tile = await Tile.findById({ _id: id }).populate({
      path: "page",
      select: "title",
    });

    if (tile === null || tile.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, tile });
  } catch (error) {
    return next(createError(error));
  }
};

const byURL = async (req, res, next) => {
  try {
    const url = req.params.url;
    const tile = await Tile.findOne({ url: url }).populate({
      path: "page",
      select: "title",
    });

    if (tile === null || tile.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, tile });
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
    checkUrl = await Tile.findOne({ url: url });
    if (checkUrl?._id.toString() === id && checkUrl.url === url) {
      const updateURL = await Tile.findByIdAndUpdate(
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
      checkUrlAgain = await Tile.findOne({ url: url });
      if (checkUrlAgain?.url === url) {
        throw createError(400, "url already taken");
      }
      const updateURL = await Tile.findByIdAndUpdate(
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
    checkUrl = await Tile.findOne({ title: title });
    if (checkUrl?._id.toString() === id && checkUrl.title === title) {
      const updateTitle = await Tile.findByIdAndUpdate(
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
      checkTitleAgain = await Tile.findOne({ title: title });
      if (checkTitleAgain?.title === title) {
        throw createError(400, "title already taken");
      }
      const updateTitle = await Tile.findByIdAndUpdate(
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
    const id = req.params.id;
    let {
      description,
      logo,
      backgroundImage,
      approvedBy,
      approve,
      archive,
      buttonColor,
      buttonTitle,
      buttonDisable,
    } = req.body;
    alreadyExist = await Tile.findById({ _id: id });

    if (alreadyExist) {
      const tile = await Tile.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          description: description,
          logo: logo,
          backgroundImage: backgroundImage,
          buttonColor: buttonColor,
          buttonTitle: buttonTitle,
          approvedBy: approvedBy,
          approve: approve,
          approveDate: approve === true ? Date.now() : undefined,
          archive: archive,
          archiveDate: archive === true ? Date.now() : undefined,
          updatedAt: Date.now(),
          buttonDisable: buttonDisable,
        }
      );
      if (tile === null || tile.length == 0) {
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

const remove = async (req, res, next) => {
  try {
    let id = req.params.id;
    const tile = await Tile.findByIdAndDelete({ _id: id });
    let pageId = tile.page.toString();
    const pages = await Page.findOneAndUpdate(
      {
        _id: pageId,
      },
      {
        $pull: { orders: id },
        updatedAt: Date.now(),
      }
    );
    if (tile === null || tile.length == 0) {
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
  tiles,
  tile,
  byURL,
  updateTitle,
  updateURL,
  update,
  remove,
};
