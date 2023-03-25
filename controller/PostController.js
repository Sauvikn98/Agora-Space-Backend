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
      upvotes: req.body.upvotes,
      downvotes: req.body.downvotes
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

// UPVOTE POST
const upvotePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user has already upvoted the post
    const hasUpvoted = post.upvotes.includes(userId);
    if (hasUpvoted) {
      return res.status(400).json({ message: 'User has already upvoted the post' });
    }

    // Remove user's downvote if they have already downvoted
    if (post.downvotes.includes(userId)) {
      await Post.findByIdAndUpdate(postId, { $pull: { downvotes: userId } });
    }

    // Add user's upvote
    await Post.findByIdAndUpdate(postId, { $push: { upvotes: userId } });
    res.json({ message: 'Post upvoted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// DOWNVOTE POST
const downvotePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user has already downvoted the post
    const hasDownvoted = post.downvotes.includes(userId);
    if (hasDownvoted) {
      return res.status(400).json({ message: 'User has already downvoted the post' });
    }

    // Remove user's upvote if they have already upvoted
    if (post.upvotes.includes(userId)) {
      await Post.findByIdAndUpdate(postId, { $pull: { upvotes: userId } });
    }

    // Add user's downvote
    await Post.findByIdAndUpdate(postId, { $push: { downvotes: userId } });
    res.json({ message: 'Post downvoted' });
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
  upvotePost,
  downvotePost,
  getPostById,
  updatePost,
  deletePost,
};