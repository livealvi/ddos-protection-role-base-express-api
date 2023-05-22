const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    icon: {
        type: String
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

module.exports = mongoose.model("Badge", BadgeSchema);
