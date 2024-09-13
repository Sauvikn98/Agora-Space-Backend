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
UserRouter.post('/api/users/register', createUser);

// login a user
UserRouter.post('/api/users/login', loginUser);

// get a user by userName
UserRouter.get('/api/users/:userName', getUserByUserName);

// get a user by userId
UserRouter.get('/api/users/:userId', getUserById);

// update a user
UserRouter.put('/api/user', auth, updateUser);

// delete a user
UserRouter.post('/api/users/:userId', auth, deleteUser);

// add a bookmark
UserRouter.post('/api/users/bookmark/:postId', auth, addBookmark);

// get all bookmark for a user
UserRouter.post('/api/users/bookmarks', auth, getAllBookmarks);


module.exports = { UserRoutes: UserRouter };
