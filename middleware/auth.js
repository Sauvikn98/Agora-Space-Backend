const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.headers["authorization"];

  // Check if Authorization Header is present
  if (!authHeader) {
    return res.status(401).json({ msg: "Authorization header is missing" });
  }
  const token = authHeader.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: "Authorization token is missing, access denied" });
  }

  console.log({ token });

  // Verify token
  try {
    jwt.verify(token, process.env.JWT_TOKEN, async (error, decoded) => {
      // check if the token is valid or not
      if (error) {
        return res.status(401).json({ msg: "Invalid Token, access denied" });
      } else {
        // check if the user associated with the token is found in the database
        const user = await User.findOne({ _id: decoded.user.id });
        // if the user associated with the token is not found, access denied
        if (!user) {
          return res.status(401).json({ msg: "User not found, access denied" });
        }
        req.user = user;
        next();
      }
    });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // if Invalid token check
      if (err instanceof jwt.NotBeforeError) {
        // Token not yet valid
        return res.status(401).json({ msg: "Token not yet valid, Please try again later" });
      } else {
        // Invalid token for other reasons
        return res.status(401).json({ msg: "Invalid token, Please try again" });
      }
    } else if (err instanceof jwt.TokenExpiredError) {
      // Token has expired
      return res.status(401).json({ msg: "Token has expired, Please login again" });
    } else {
      // Other errors
      console.error(err);
      return res.status(500).json({ msg: "Server error" });
    }
  }
};
