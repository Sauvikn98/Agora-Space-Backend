const express = require("express");
const PostRouter = new express.Router();
const auth = require("../middleware/auth");
const {
    createPost,
    getPosts,
    getPostsByKeywordAndCategory,
    getPostById,
    updatePost,
    deletePost,
  } = require("../controller/PostController");

  // create new post
  PostRouter.post("/posts/", createPost);

  // get all posts
  PostRouter.get("/posts/", getPosts);

  // make GET requests to /posts/search?text=keyword&category=categoryname
  PostRouter.get('/posts/search', getPostsByKeywordAndCategory);

  // get post with a postId
  PostRouter.get("/posts/:postId", getPostById);

  // update a post
  PostRouter.patch("/posts/:postId", auth, updatePost);

  // delete a post
  PostRouter.delete("/posts/:postId", auth, deletePost);
  

  module.exports = {PostRoutes:PostRouter};