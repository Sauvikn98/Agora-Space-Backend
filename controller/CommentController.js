const { Comment } = require("../models");
const { Post } = require("../models");

// Function to create a new comment
const createComment = async (req, res) => {
  try {
    const comment = new Comment({
      post: req.body.post,
      author: req.body.author,
      parentComment: req.body.parentComment || null,
      content: req.body.content,
    });
    await Post.findByIdAndUpdate(
      comment.post,
      { $push: { comments: comment._id } },
      { new: true }
    );
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author")
      .populate({ path: "children", populate: { path: "author" } });
    const nestedComments = arrangeComments(comments);
    res.status(200).json(nestedComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const arrangeComments = (comments) => {
  const commentMap = {};

  // create a map of comments by id
  comments.forEach((comment) => {
    commentMap[comment._id] = comment;
    comment.children = [];
  });

  // assign child comments to their parent comments recursively
  for (const id in commentMap) {
    const comment = commentMap[id];
    if (comment.parentComment !== null) {
      commentMap[comment.parentComment].children.push(comment);
    }
  }

  // recursively append child comments to their parent comments
  const appendChildren = (comment) => {
    if (comment.children) {
      comment.children.forEach((child) => {
        child.children = commentMap[child._id].children;
        appendChildren(child);
      });
    }
  };

  // iterate over top-level comments and add their children recursively
  comments.forEach((comment) => {
    if (comment.parentComment === null) {
      appendChildren(comment);
    }
  });

  return comments.filter((comment) => comment.parentComment === null);
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
