const mongoose = require("mongoose");

const PageRequestSchema = new mongoose.Schema({
  page: {
    type: mongoose.Types.ObjectId,
    ref: "Page",
    require: true,
  },
  requestBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

module.exports = mongoose.model("PageRequest", PageRequestSchema);
