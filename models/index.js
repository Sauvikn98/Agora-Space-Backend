const {mongoose} = require("mongoose");
const userSchema = require("./User");
const postSchema = require("./Post");
const spaceSchema = require("./Space");
const commentSchema = require("./Comment");
const notificationSchema = require("./Notification");
const refreshToken = require("./RefreshToken");
const label = require("./Label")

const User = mongoose.model("user", userSchema);
const Post = mongoose.model("post", postSchema);
const Space = mongoose.model("space", spaceSchema);
const Comment = mongoose.model("comment", commentSchema);
const Notification = mongoose.model("notification", notificationSchema);
const RefreshToken = mongoose.model("refreshToken", refreshToken)
const Label = mongoose.model("label", label)

module.exports = {
    User,
    Post,
    Space,
    Comment,
    Notification,
    RefreshToken,
    Label
}