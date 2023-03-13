const { Space } = require("../models");

// Function to create a new space/group
const createSpace = async (req, res) => {
  try {
    const space = new Space({
      name: req.body.name,
      description: req.body.description,
      creator: req.body.creator,
      posts: req.body.posts,
      members: req.body.members,
    });
    if (req.body.postId) {
      space.posts.push(req.body.postId);
    }
    await space.save();
    res.status(201).json(space);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Function to get all spaces/groups
const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find();
    res.status(200).json(spaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Function to get a single space/group by ID
const getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.spaceId).populate("creator", "userName");
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }
    res.status(200).json(space);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Function to get all posts of a single space/group by ID
const getSpacePosts = async (req, res) => {
  try {
    const space = await Space.findById(req.params.spaceId).populate("posts");
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }
    res.status(200).json(space.posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Function to update a space/group by ID
const updateSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.spaceId);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }
    
    {/*if (space.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this space" });
    }
    space.name = req.body.name || space.name;
  space.description = req.body.description || space.description;*/}

    // Add the new post ID to the posts array of the space document
    if (req.body.postId) {
      space.posts.push(req.body.postId);
    }

    await space.save();
    res.status(200).json(space);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


// Function to delete a space/group by ID
const deleteSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.spaceId);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }
    if (space.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this space" });
    }
    await space.remove();
    res.status(200).json({ message: "Space deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createSpace,
  getSpaces,
  getSpaceById,
  getSpacePosts,
  updateSpace,
  deleteSpace
};
