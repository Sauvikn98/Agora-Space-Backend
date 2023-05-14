const express = require("express");
const UserRouter = new express.Router();
const auth = require("../middleware/auth");
const {
  createUser,
  loginUser,
  getUserByUserName,
  getUserById,
  updateUser,
  deleteUser,
  addBookmark,
  getAllBookmarks
} = require("../controller/UserController");

// create a new user  
UserRouter.post('/users/register', createUser);

// login a user
UserRouter.post('/users/login', loginUser);

// get a user by userName
UserRouter.get('/users/:userName', getUserByUserName);

// get a user by userId
UserRouter.get('/users/:userId', getUserById);

// update a user
UserRouter.patch('/user', auth, updateUser);

// delete a user
UserRouter.delete('/users/:userId', auth, deleteUser);

// add a bookmark
UserRouter.post('/users/bookmark/:postId', auth, addBookmark);

// get all bookmark for a user
UserRouter.post('/users/bookmarks', auth, getAllBookmarks);

module.exports = { UserRoutes: UserRouter };