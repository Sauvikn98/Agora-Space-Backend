const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "30d", // Automatically remove documents after 30 days
  },
});

module.exports = refreshTokenSchema;
