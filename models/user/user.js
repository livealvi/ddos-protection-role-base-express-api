const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: { type: String, require: true, unique: true, trim: true },
  password: { type: String, require: true, trim: true },
  role: {
    type: mongoose.Types.ObjectId,
    ref: "Role",
    default: "64231bf9f21deb779a148c64",
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
  url: {
    type: String,
  },
  tag: {
    type: String,
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

module.exports = mongoose.model("User", UserSchema);
