const { upload } = require('../cloudinary/cloudinary');
const { Post } = require('../models');
const { Space, User } = require("../models");
const cloudinary = require("cloudinary").v2;
const _ = require("lodash");

const createPost = async (req, res) => {
  try {
    let multimediaUrl = null;

    const uploadPromise = new Promise((resolve, reject) => {
      upload.single('multimedia')(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        if (!req.file) {
          return reject(new Error('No file uploaded'));
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
      labels: req.body.labels,
      author: req.body.author,
      space: req.body.space,
      multimedia: multimediaUrl,
      upvotes: req.body.upvotes,
      downvotes: req.body.downvotes
    });

    await Space.findByIdAndUpdate(
      post.space,
      { $push: { posts: post._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(req.body.author, {
      $push: { "posts": post._id }
    });

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

    const hasUpvoted = post.upvotes.includes(userId);
    if (hasUpvoted) {
      return res.status(400).json({ message: 'User has already upvoted the post' });
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
      return res.status(400).json({ message: 'User has already downvoted the post' });
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

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vectorA, vectorB) {
  const dotProduct = _.sum(_.zipWith(vectorA, vectorB, (a, b) => a * b));
  const magnitudeA = Math.sqrt(_.sum(_.map(vectorA, (a) => a * a)));
  const magnitudeB = Math.sqrt(_.sum(_.map(vectorB, (b) => b * b)));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function getPostRecommendations(userId) {
  try {
    // Get the user's posts
    const user = await User.findById(userId).populate("posts");
    const userPosts = user.posts.map((post) => post._id.toString());

    // Fetch all posts from the database
    const allPosts = await Post.find().populate("space");

    // Filter posts by space category and exclude user's own posts
    const userCategories = _.flatMap(userPosts, (postId) => {
      const post = allPosts.find((p) => p._id.toString() === postId);
      return post ? post.space.category : [];
    });
    const filteredPosts = _.filter(allPosts, (post) =>
      _.intersection(userCategories, post.space.category).length > 0 &&
      !userPosts.includes(post._id.toString())
    );

    // Calculate user similarity based on post categories using cosine similarity
    const userVectors = _.map(filteredPosts, (post) =>
      _.map(userPosts, (userPost) =>
        post.space.category.includes(userPost) ? 1 : 0
      )
    );
    const currentUserVector = _.map(userPosts, (userPost) =>
      userPost === userId ? 1 : 0
    );
    const similarities = _.map(userVectors, (vector) =>
      cosineSimilarity(vector, currentUserVector)
    );

    // Sort posts by similarity in descending order
    const sortedPosts = _.orderBy(filteredPosts, similarities, "desc");

    return sortedPosts;
  } catch (error) {
    console.error("Error in getPostRecommendations:", error);
    throw error;
  }
}

const getAllPostRecommendations = async (req, res) => {
  const userId = req.params.userId;
  try {
    const recommendations = await getPostRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to retrieve post recommendations" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostsByKeyword,
  upvotePost,
  downvotePost,
  getPostById,
  updatePost,
  deletePost,
  getAllPostRecommendations
};