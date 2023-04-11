const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
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
  },
  icon: {
    type: String,
  },
  favIcon: {
    type: String,
  },
  color: {
    type: String,
  },
  logo: {
    type: String,
  },
  backgroundImage: {
    type: String,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
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
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Tile",
    },
  ],
  archiveDate: {
    type: Date,
    immutable: true,
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

module.exports = mongoose.model("Page", PageSchema);
