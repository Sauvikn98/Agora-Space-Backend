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
  CommentRouter.post("/api/comments", createComment);

  // get all comments for a Post
  CommentRouter.get("/api/comments/:postId", getCommentsByPost);

  // update a comment by ID
  CommentRouter.patch("/api/comments/:commentId", auth, updateComment);

  // delete a comment by ID
  CommentRouter.delete("/api/comments/:commentId", auth, deleteComment);
  

  module.exports = {CommentRoutes:CommentRouter};
