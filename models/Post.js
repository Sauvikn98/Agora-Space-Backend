const mongoose = require("mongoose");


const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        category: {
            type: [String],
            enum: ['Gaming', 'Sports', 'Business', 'Technology', 'Art', 'Anime', 'Crypto', 'Fashion', 'Food and Drink'],
            required: true,
        },
        space: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "space",
          },
        multimedia: {
            type: String
        },
        upvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }],
        downvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }],
    },
    { timestamps: true },
);

module.exports = postSchema;