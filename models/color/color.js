const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema({
  code: {
    type: String,
    require: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    immutable: true,
  },
});

module.exports = mongoose.model("Color", ColorSchema);
