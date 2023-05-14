const { upload } = require('../cloudinary/cloudinary');
const { Post } = require('../models');
const { Space } = require("../models");
const cloudinary = require("cloudinary").v2;

const createPost = async (req, res) => {
  try {
    let multimediaUrl = null;

    const uploadPromise = new Promise((resolve, reject) => {
      upload.single('multimedia')(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        if (!req.file) {
          return resolve();
        }
        cloudinary.uploader.upload(req.file.path, { resource_type: "raw" }, (error, result) => {
          if (error) {
            return reject(error);
          }
          multimediaUrl = result.secure_url;
          resolve();
        });
      });
    });

    await uploadPromise;

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      space: req.body.space,
      upvotes: req.body.upvotes,
      downvotes: req.body.downvotes
    });

    if (req.body.label) {
      post.label = req.body.label;
    }

    if (multimediaUrl) {
      post.multimedia = multimediaUrl;
    }

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

// SEARCH POST BY KEYWORD
const getPostsByKeyword = async (req, res) => {
  const { text } = req.query;

  try {
    const posts = await Post.find({
      title: { $regex: new RegExp(text, 'i') }
    }).populate('author');

    if (posts.length === 0) {
      return res.status(200).json({ message: 'No matching posts found' });
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

    const hasUpvoted = post.upvotes.includes(userId);
    if (hasUpvoted) {
      await Post.findByIdAndUpdate(postId, { $pull: { upvotes: userId } });
      return res.json({ message: 'Post upvote removed' });
    }

    if (post.downvotes.includes(userId)) {
      await Post.findByIdAndUpdate(postId, { $pull: { downvotes: userId } });
    }

    await Post.findByIdAndUpdate(postId, { $push: { upvotes: userId } });
    res.json({ message: 'Post upvoted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const downvotePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const hasDownvoted = post.downvotes.includes(userId);
    if (hasDownvoted) {
      await Post.findByIdAndUpdate(postId, { $pull: { downvotes: userId } });
      return res.json({ message: 'Post downvote removed' });
    }

    if (post.upvotes.includes(userId)) {
      await Post.findByIdAndUpdate(postId, { $pull: { upvotes: userId } });
    }

    await Post.findByIdAndUpdate(postId, { $push: { downvotes: userId } });
    res.json({ message: 'Post downvoted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}


// UPDATE
const updatePost = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    let multimediaUrl = post.multimedia;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'raw',
      });
      multimediaUrl = result.secure_url;
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.multimedia = multimediaUrl || post.multimedia;
    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


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
  getPostsByKeyword,
  upvotePost,
  downvotePost,
  getPostById,
  updatePost,
  deletePost,
};