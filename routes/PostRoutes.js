const express = require("express");
const PostRouter = new express.Router();
const auth = require("../middleware/auth");
const {
  createPost,
  getPosts,
  getPostsByKeyword,
  getPostById,
  upvotePost,
  downvotePost,
  updatePost,
  deletePost,
} = require("../controller/PostController");

// create new post
PostRouter.post("/posts", createPost);

// get all posts
PostRouter.get("/posts", getPosts);

// search posts by keyword /posts/search?text=asdsd
PostRouter.get('/posts/search', getPostsByKeyword);

// get post with a postId
PostRouter.get("/posts/:postId", getPostById);

// upvote a post
PostRouter.patch("/posts/:postId/upvote", auth, upvotePost);

// downvote a post
PostRouter.patch("/posts/:postId/downvote", auth, downvotePost);

// update a post
PostRouter.put("/posts/:postId", auth, updatePost);

// delete a post
PostRouter.delete("/posts/:postId", auth, deletePost);


module.exports = { PostRoutes: PostRouter };