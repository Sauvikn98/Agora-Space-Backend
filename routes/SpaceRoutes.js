const express = require("express");
const SpaceRouter = new express.Router();
const auth = require("../middleware/auth");
const {
  createSpace,
  getSpaces,
  getSpaceById,
  getSpacePosts,
  updateSpace,
  joinSpace,
  leaveSpace,
  deleteSpace
} = require("../controller/SpaceController");

// create new space
SpaceRouter.post("/spaces", createSpace);

// get all spaces
SpaceRouter.get("/spaces", getSpaces);

// get space with a spaceId
SpaceRouter.get("/spaces/:spaceId", getSpaceById);

// get all Posts of a particular space
SpaceRouter.get("/spaces/:spaceId/posts", getSpacePosts);

// update a space
SpaceRouter.put("/spaces/:spaceId", updateSpace);

// join a space
SpaceRouter.put("/spaces/:spaceId/join", auth, joinSpace);

// leave a space
SpaceRouter.delete("/spaces/:spaceId/leave", auth, leaveSpace);

// delete a space
SpaceRouter.delete("/spaces/:spaceId", auth, deleteSpace);


module.exports = { SpaceRoutes: SpaceRouter };