const mongoose = require("mongoose");

const TAGSchema = new mongoose.Schema({
  tag: {
    type: String,
    require: true,
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

module.exports = mongoose.model("Tag", TAGSchema);
