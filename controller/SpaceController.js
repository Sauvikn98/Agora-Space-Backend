const { upload } = require("../cloudinary/cloudinary");
const { Space, User, Label} = require("../models");
const cloudinary = require("cloudinary").v2;;
const _ = require("lodash");

// Function to create a new space/group
const createSpace = async (req, res) => {
  try {
    const space = new Space({
      name: req.body.name,
      description: req.body.description,
      creator: req.body.creator,
      posts: req.body.posts,
      members: req.body.members,
      category: req.body.category,
      coverPhoto: req.body.coverPhoto,
      labels: req.body.labels
    });
    if (req.body.postId) {
      space.posts.push(req.body.postId);
    }
    space.members.push(req.body.creator);
    await space.save();

    await User.findByIdAndUpdate(req.body.creator, {
      $push: { "spaces.created": space._id }
    });

    res.status(201).json(space);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const uploadCoverPhoto = async (req, res) => {
  const spaceId = req.params.spaceId;
  try {
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    let coverPhotoUrl = null;

    const uploadPromise = new Promise((resolve, reject) => {
      upload.single('coverPhoto')(req, res, (err) => {
        if (err) {
          return reject(err);
        }

        if (!req.file) {
          return reject(new Error('No file uploaded'));
        }

        cloudinary.uploader.upload(req.file.path, (error, result) => {
          if (error) {
            return reject(error);
          }

          coverPhotoUrl = result.secure_url;
          resolve();
        });
      });
    });

    await uploadPromise;
    space.coverPhoto = coverPhotoUrl;
    await space.save();

    res.json(space);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all spaces/groups
const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find().populate("posts").populate("labels");
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

// join a space
const joinSpace = async (req, res) => {
  const spaceId = req.params.spaceId;
  const userId = req.user._id;
  console.log(spaceId);
  console.log(userId);

  try {
    const space = await Space.findById(spaceId);
    if (space.members.includes(userId)) {
      return res.status(400).json({ error: "User is already a member of the space" });
    }
    space.members.push(userId);
    await space.save();

    await User.findByIdAndUpdate(userId, {
      $push: { "spaces.memberOf": space._id }
    });

    return res.status(200).json({ message: "User joined the space successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to join the space" });
  }
};

// leave a space
const leaveSpace = async (req, res) => {
  const spaceId = req.params.spaceId;
  const userId = req.user._id;

  try {
    const space = await Space.findById(spaceId);
    if (!space.members.includes(userId)) {
      return res.status(400).json({ error: "User is not a member of the space" });
    }

    space.members = space.members.filter(memberId => !memberId.equals(userId));
    await space.save();
    await User.findByIdAndUpdate(userId, {
      $pull: { "spaces.memberOf": space._id }
    });
    return res.status(200).json({ message: "User left the space successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to leave the space" });
  }
};

// Function to get all members of a single space/group by ID
const getSpaceMembers = async (req, res) => {
  try {
    const space = await Space.findById(req.params.spaceId).populate("members", "-password");
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }
    res.status(200).json(space.members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


const createLabel = async (req, res) => {
  try {
    const { spaceId } = req.params;

    const space = await Space.findById(spaceId);

    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    const label = new Label({
      name: req.body.name, color: req.body.color, spaceId: space._id 
    });
    console.log(label)
    await label.save();
    await Space.findByIdAndUpdate(spaceId, {
      $push: { "labels": label._id }
    });

    res.status(201).json(label);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllLabels = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const labels = await Label.find({ spaceId }).exec();
    res.json(labels);
  } catch (error) {
    console.error("Error in getAllLabelsForSpace:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateLabel = async (req, res) => {
  try {
    const { spaceId, labelId } = req.params;
    const { name, color } = req.body;

    const space = await Space.findById(spaceId);

    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    const labelIndex = space.labels.findIndex(label => label._id == labelId);

    if (labelIndex === -1) {
      return res.status(404).json({ message: 'Label not found' });
    }

    const updatedLabel = { _id: labelId, name, color };
    space.labels[labelIndex] = updatedLabel;
    await space.save();

    res.json(updatedLabel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteLabel = async (req, res) => {
  try {
    const { spaceId, labelId } = req.params;

    const space = await Space.findById(spaceId);

    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    const labelIndex = space.labels.findIndex(label => label._id == labelId);

    if (labelIndex === -1) {
      return res.status(404).json({ message: 'Label not found' });
    }

    space.labels.splice(labelIndex, 1);

    await space.save();

    res.status(200).json({ message: 'Label deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vectorA, vectorB) {
  const dotProduct = _.sum(_.zipWith(vectorA, vectorB, (a, b) => a * b));
  const magnitudeA = Math.sqrt(_.sum(_.map(vectorA, (a) => a * a)));
  const magnitudeB = Math.sqrt(_.sum(_.map(vectorB, (b) => b * b)));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Function to get space recommendations for a user
async function getSpaceRecommendations(userId) {
  try {
    // Get the user's spaces
    const user = await User.findById(userId).populate("spaces.memberOf");
    const userSpaces = user.spaces.memberOf.map((space) => space._id.toString());

    // Fetch all spaces from the database
    const allSpaces = await Space.find().populate("members");

    // Filter spaces by category and exclude spaces the user is already a member of
    const userCategories = _.flatMap(userSpaces, (spaceId) => {
      const space = allSpaces.find((s) => s._id.toString() === spaceId);
      return space ? space.category : [];
    });
    const filteredSpaces = _.filter(allSpaces, (space) =>
      _.intersection(userCategories, space.category).length > 0 &&
      !userSpaces.includes(space._id.toString())
    );

    // Calculate user similarity based on space membership using cosine similarity
    const userVectors = _.map(filteredSpaces, (space) => {
      const members = space.members.map((member) => member._id.toString());
      return _.map(userSpaces, (userSpace) =>
        members.includes(userSpace) ? 1 : 0
      );
    });
    const currentUserVector = _.map(userSpaces, (userSpace) =>
      userSpace === userId ? 1 : 0
    );
    const similarities = _.map(userVectors, (vector) =>
      cosineSimilarity(vector, currentUserVector)
    );

    // Sort spaces by similarity in descending order
    const sortedSpaces = _.orderBy(filteredSpaces, similarities, "desc");

    return sortedSpaces;
  } catch (error) {
    console.error("Error in getSpaceRecommendations:", error);
    throw error;
  }
}




// Function to delete a space/group by ID
const getAllSpaceRecommendations = async (req, res) => {
  const userId = req.params.userId;
  try {
    const recommendations = await getSpaceRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to retrieve space recommendations" });
  }
};

module.exports = {
  createSpace,
  getSpaces,
  getSpaceById,
  getSpacePosts,
  joinSpace,
  leaveSpace,
  uploadCoverPhoto,
  getSpaceMembers,
  createLabel,
  getAllLabels,
  updateLabel,
  deleteLabel,
  updateSpace,
  deleteSpace,
  getAllSpaceRecommendations
};
