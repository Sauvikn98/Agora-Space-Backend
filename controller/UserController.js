const { User, Post} = require("../models")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { email, password, userName, online, /*profileImage*/ } = req.body;
  console.log(req.body)
  console.log(email, password, userName, online)
  try {
    let user = await User.findOne({ userName });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    user = new User({
      userName,
      email,
      password,
      online
      /*profileImage*/
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id,
        userName: user.userName,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_TOKEN,
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ error: "User does not exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        userName: user.userName,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_TOKEN,
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) throw err;
        return res.json({ token, user });
      }
    );
  } catch (error) {
    return res.status(400).send({ error: "Some error occured" });
  }
}

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
  const updates = Object.keys(req.body);
  const allowedUpdates = ['userName', 'email', 'password'];
  const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid update(s)!' });
  }

  // find the user by id
  const user = await User.findById(req.user.id);

  // update the user properties
  updates.forEach(async update => {
    if (update === 'password') {
      if (req.body.password) { // only update password if it is provided
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user[update] = hashedPassword;
      }
    } else {
      user[update] = req.body[update];
    }
  });

  try {
    // save the updated user
    await user.save();

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};



const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete({ _id: id });
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