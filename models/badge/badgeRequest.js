const mongoose = require("mongoose");

const BadgeRequestSchema = new mongoose.Schema({
  badge: {
    type: mongoose.Types.ObjectId,
    ref: "Badge",
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

module.exports = mongoose.model("BadgeRequest", BadgeRequestSchema);
