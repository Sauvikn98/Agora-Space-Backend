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

    if (space.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this space" });
    }
    space.name = req.body.name || space.name;
    space.description = req.body.description || space.description;

    await space.save();
    res.status(200).json(space);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// join a space
const joinSpace = async (req, res) => {
  const spaceId = req.params.spaceId;
  const userId = req.user._id; // assuming the user is authenticated and the user id is stored in req.user._id
  console.log(spaceId); // Add this line to log the value of space
  console.log(userId);

  try {
    // check if the user is already a member of the space
    const space = await Space.findById(spaceId);
    if (space.members.includes(userId)) {
      return res.status(400).json({ error: "User is already a member of the space" });
    }

    // add user id to the members array
    space.members.push(userId);
    await space.save();

    return res.status(200).json({ message: "User joined the space successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to join the space" });
  }
};

// leave a space
const leaveSpace = async (req, res) => {
  const spaceId = req.params.spaceId;
  const userId = req.user._id; // assuming the user is authenticated and the user id is stored in req.user._id

  try {
    // check if the user is a member of the space
    const space = await Space.findById(spaceId);
    if (!space.members.includes(userId)) {
      return res.status(400).json({ error: "User is not a member of the space" });
    }

    // remove user id from the members array
    space.members = space.members.filter(memberId => !memberId.equals(userId));
    await space.save();

    return res.status(200).json({ message: "User left the space successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to leave the space" });
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
  joinSpace,
  leaveSpace,
  deleteSpace
};
