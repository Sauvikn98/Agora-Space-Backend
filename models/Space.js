const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
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
    ref: "user"
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    }
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }
  ]
},
{ timestamps: true },
);

module.exports = spaceSchema;
