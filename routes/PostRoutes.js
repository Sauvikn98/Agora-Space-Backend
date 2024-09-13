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
  getAllPostRecommendations
} = require("../controller/PostController");

// create new post
PostRouter.post("/api/posts", createPost);

// get all posts
PostRouter.get("/api/posts", getPosts);

// search posts by keyword /posts/search?text=asdsd
PostRouter.get('/api/posts/search', getPostsByKeyword);

// get post with a postId
PostRouter.get("/api/posts/:postId", getPostById);

// upvote a post
PostRouter.patch("/api/posts/:postId/upvote", auth, upvotePost);

// downvote a post
PostRouter.patch("/api/posts/:postId/downvote", auth, downvotePost);

// update a post
PostRouter.put("/api/posts/:postId", auth, updatePost);

// delete a post
PostRouter.delete("/api/posts/:postId", auth, deletePost);

PostRouter.get("/api/posts/post-recommendations/:userId", getAllPostRecommendations);


module.exports = { PostRoutes: PostRouter };
