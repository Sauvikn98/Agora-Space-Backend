const mongoose = require("mongoose");


const spaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    }],
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }],
    coverPhoto: {
      type: String
    },
    category: {
      type: [String],
      enum: ['Gaming', 'Sports', 'Business', 'Technology', 'Art', 'Anime', 'Crypto', 'Fashion', 'Food and Drink'],
      required: true
    },
    labels: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "label"
    }]
  },
  { timestamps: true },
);

module.exports = spaceSchema;
