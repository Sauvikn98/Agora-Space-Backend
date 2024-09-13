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
  uploadCoverPhoto,
  updateLabel,
  deleteLabel,
  updateSpace,
  deleteSpace,
  getAllSpaceRecommendations
} = require("../controller/SpaceController");

// create new space
SpaceRouter.post("/api/spaces", createSpace);

// get all spaces
SpaceRouter.get("/api/spaces", getSpaces);

// get space with a spaceId
SpaceRouter.get("/api/spaces/:spaceId", getSpaceById);

// get all Posts of a particular space
SpaceRouter.get("/api/spaces/:spaceId/posts", getSpacePosts);

// join a space
SpaceRouter.put("/api/spaces/:spaceId/join", auth, joinSpace);

// leave a space
SpaceRouter.delete("/api/spaces/:spaceId/leave", auth, leaveSpace);

// get all members of a particular space
SpaceRouter.get("/api/spaces/:spaceId/members", getSpaceMembers);

// create space labels
SpaceRouter.post("/api/spaces/:spaceId/labels", createLabel);

// upload cover photo
SpaceRouter.post("/api/spaces/:spaceId/cover-photo", auth, uploadCoverPhoto);

// get all space labels
SpaceRouter.get("/api/spaces/:spaceId/labels", getAllLabels);

// update a space label
SpaceRouter.put("/api/spaces/:spaceId/labels/:labelId", updateLabel);

// delete a space label
SpaceRouter.delete("/api/spaces/:spaceId/labels/:labelId", deleteLabel);

// update a space
SpaceRouter.put("/api/spaces/:spaceId", updateSpace);

// delete a space
SpaceRouter.delete("/api/spaces/:spaceId", auth, deleteSpace);


SpaceRouter.get("/api/spaces/space-recommendations/:userId", getAllSpaceRecommendations);


module.exports = { SpaceRoutes: SpaceRouter };
