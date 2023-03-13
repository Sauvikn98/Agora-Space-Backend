const {Post} = require('../models');
const { Space } = require("../models");

// CREATE NEW POST
const createPost = async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category, 
      author: req.body.author,
      space: req.body.space,
      multimedia: req.body.multimedia,
    });
    await Space.findByIdAndUpdate(
      post.space,
      { $push: { posts: post._id } },
      { new: true }
    );
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET ALL POSTS
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// SEARCH POST BY KEYWORD AND CATEGORY
const getPostsByKeywordAndCategory = async (req, res) => {
  const { text, category } = req.query;

  try {
    const posts = await Post.find({
      title: { $regex: new RegExp(text, 'i') },
      category: category
    });
    
    if (posts.length === 0) {
      return res.status(404).json({ error: 'No matching posts found' });
    }

    return res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

  

// SEARCH POST BY POST ID
const getPostById = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// UPDATE
const updatePost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.author = req.body.author || post.author;
    post.spaceId = req.body.spaceId || post.spaceId;
    post.multimedia = req.body.multimedia || post.multimedia;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// DELETE
const deletePost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await post.remove();
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createPost,
  getPosts,
  getPostsByKeywordAndCategory,
  getPostById,
  updatePost,
  deletePost,
};
