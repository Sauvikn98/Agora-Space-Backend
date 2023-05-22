const { User, RefreshToken } = require("../models")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { upload } = require('../cloudinary/cloudinary');

const createUser = async (req, res) => {
  const { email, password, userName, avatar} = req.body;

  try {
    let user = await User.findOne({ userName });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    user = new User({
      userName,
      email,
      password,
      avatar
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Generate access token
    const accessTokenPayload = {
      user: {
        id: user.id,
        userName: user.userName,
      },
    };
    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.JWT_TOKEN,
      { expiresIn: "15 minutes" }
    );

    // Generate refresh token
    const refreshTokenPayload = {
      user: {
        id: user.id,
      },
    };
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30 days" }
    );

    // Store the refresh token securely (e.g., in a database)
    // Here, assume you have a refresh token model and you save it in a refreshTokens collection
    const refreshDBToken = new RefreshToken({
      token: refreshToken,
      userId: user.id,
    });
    await refreshDBToken.save();

    // Return access token and refresh token
    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect credentials" });
    }

    // Generate access token
    const accessTokenPayload = {
      user: {
        id: user.id,
        userName: user.userName,
      },
    };
    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.JWT_TOKEN,
      { expiresIn: "15 minutes" }
    );

    // Generate refresh token
    const refreshTokenPayload = {
      user: {
        id: user.id,
      },
    };
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30 days" }
    );

    // Store the refresh token securely (e.g., in a database)
    // Here, assume you have a refresh token model and you save it in a refreshTokens collection
    const refreshDBToken = new RefreshToken({
      token: refreshToken,
      userId: user.id,
    });
    await refreshDBToken.save();

    // Return access token and refresh token
    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    res.status(400).json({ error: "Some error occurred" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  console.log({ id })
  try {
    const user = await User.findById({ _id: id }).select(
      "-password -updatedAt -createdAt"
    );
    res.json(user);
  } catch (err) {
    console.log({ err })
    res.status(500).json({ error: "Server Error" });
  }
};

const getUserByUserName = async (req, res) => {
  const { userName } = req.params;
  User.find({ userName }).then((users) => res.status(200).send(users));
};



const updateUser = async (req, res) => {
  const { firstName, lastName, bio, avatar, banner, country } = req.body;
  const userId = req.user._id; // Assuming you have implemented user authentication

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the optional fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.bio = bio || user.bio;
    user.avatar = avatar || user.avatar;
    user.country = country || user.country;

     // Check if banner image is provided
     if (req.file) {
      // Upload the banner image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });

      // Update the user's banner with the secure URL from Cloudinary
      user.banner = result.secure_url;
    }

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "User settings updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};



const deleteUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addBookmark = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id

  try {
    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if post is already bookmarked by user
    if (user.bookmarks.includes(postId)) {
      return res.status(400).json({ error: "Post already bookmarked" });
    }

    // Add post to user's bookmarks
    user.bookmarks.push(postId);
    await user.save();

    res.status(200).json({ message: "Post bookmarked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllBookmarks = async (req, res) => {
  const userId = req.user._id;

  try {
    // Check if user exists
    const user = await User.findById(userId).populate("bookmarks");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserById,
  getUserByUserName,
  updateUser,
  deleteUser,
  addBookmark,
  getAllBookmarks
}