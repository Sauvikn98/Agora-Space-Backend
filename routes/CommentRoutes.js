const express = require("express");
const CommentRouter = new express.Router();
const auth = require("../middleware/auth");
const {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
  } = require("../controller/CommentController");

  // create new comment
  CommentRouter.post("/comments", createComment);

  // get all comments for a Post
  CommentRouter.get("/comments/:postId", getCommentsByPost);

  // update a comment by ID
  CommentRouter.patch("/comments/:commentId", auth, updateComment);

  // delete a comment by ID
  CommentRouter.delete("/comments/:commentId", auth, deleteComment);
  

  module.exports = {CommentRoutes:CommentRouter};