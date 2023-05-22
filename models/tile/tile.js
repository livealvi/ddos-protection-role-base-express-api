const mongoose = require("mongoose");

const TileSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    trim: true,
  },
  url: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  logo: {
    type: String,
  },
  lock: {
    type: Boolean,
    default: false,
  },
  backgroundImage: {
    type: String,
  },
  buttonColor: {
    type: String,
  },
  buttonTitle: {
    type: String,
    require: true,
  },
  buttonDisable: {
    type: Boolean,
    require: true,
  },
  page: {
    type: mongoose.Types.ObjectId,
    ref: "Page",
    require: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
  assignTo: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
  publicUrl: {
    type: String,
  },
  approvedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
  approve: {
    type: Boolean,
    default: false,
  },
  approveDate: {
    type: Date,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  archiveDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Tile", TileSchema);
