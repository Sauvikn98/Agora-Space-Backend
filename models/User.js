const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
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
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
        },
        profileImage: {
            type: String,
        },
        online: {
            type: Boolean,
            default: false
        },
        bookmarks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }],
        spaces: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "space",
        }],
    },
    { timestamps: true },
)

module.exports = userSchema;