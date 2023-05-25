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
        labels: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "label",
        }],
        space: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "space",
            required: true,
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment",
        }],
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