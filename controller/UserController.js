const { User } = require("../models")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { email, password, userName, /*profileImage*/ } = req.body;
  console.log(req.body)
  console.log(email, password, userName)
  try {
    let user = await User.findOne({ userName });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    user = new User({
      userName,
      email,
      password
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
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate({ _id: id }, { new: true }).select(
      "-updatedAt"
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
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


module.exports = {
  createUser,
  loginUser,
  getUserById,
  getUserByUserName,
  updateUser,
  deleteUser
}