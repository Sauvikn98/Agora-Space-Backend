const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },
        avatar: {
            type: String,
        },
        banner: {
            type: String,
        },
        country: {
            type: String,
            trim: true,
        },
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is not valid");
                }
            },
            trim: true,
            lowercase: true,
        },
        bookmarks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }],
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
        },
    },
    { timestamps: true },
)

module.exports = userSchema;