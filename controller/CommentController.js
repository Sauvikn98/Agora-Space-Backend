const {Comment} = require("../models");

// Function to create a new comment
const createComment = async (req, res) => {
  try {
    const comment = new Comment({
      post: req.body.postId,
      author: req.body.author,
      parentComment: req.body.parentCommentId || null,
      content: req.body.content,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Function to get all comments for a post
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate("author", "userName");
    const nestedComments = arrangeComments(comments);
    res.status(200).json(nestedComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Helper function to arrange comments in a nested structure
const arrangeComments = (comments) => {
    const commentMap = {};
    const nestedComments = [];
  
    comments.forEach((comment) => {
      commentMap[comment._id] = comment;
      commentMap[comment._id].children = [];
    });
  
    for (const id in commentMap) {
      const comment = commentMap[id];
      if (comment.parentComment !== null) {
        commentMap[comment.parentComment].children.push(comment);
      } else {
        nestedComments.push(comment);
      }
    }
  
    return nestedComments;
  };

// Function to update a comment by ID
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this comment" });
    }
    comment.content = req.body.content || comment.content;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Function to delete a comment by ID
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }
    await comment.remove();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};



module.exports = { 
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
};
