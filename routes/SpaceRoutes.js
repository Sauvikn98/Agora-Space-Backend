const express = require("express");
const SpaceRouter = new express.Router();
const auth = require("../middleware/auth");
const {
  createSpace,
  getSpaces,
  getSpaceById,
  getSpacePosts,
  joinSpace,
  leaveSpace,
  getSpaceMembers,
  createLabel,
  getAllLabels,
  updateLabel,
  deleteLabel,
  updateSpace,
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

// join a space
SpaceRouter.put("/spaces/:spaceId/join", auth, joinSpace);

// leave a space
SpaceRouter.delete("/spaces/:spaceId/leave", auth, leaveSpace);

// get all members of a particular space
SpaceRouter.get("/spaces/:spaceId/members", getSpaceMembers);

// create space labels
SpaceRouter.post("/spaces/:spaceId/labels", createLabel);

// get all space labels
SpaceRouter.get("/spaces/:spaceId/labels", getAllLabels);

// update a space label
SpaceRouter.put("/spaces/:spaceId/labels/:labelId", updateLabel);

// delete a space label
SpaceRouter.delete("/spaces/:spaceId/labels/:labelId", deleteLabel);

// update a space
SpaceRouter.put("/spaces/:spaceId", updateSpace);

// delete a space
SpaceRouter.delete("/spaces/:spaceId", auth, deleteSpace);


module.exports = { SpaceRoutes: SpaceRouter };