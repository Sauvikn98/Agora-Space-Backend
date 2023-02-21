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
            if(!validator.isEmail(value)){
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
},
  { timestamps: true },
)

module.exports = userSchema;