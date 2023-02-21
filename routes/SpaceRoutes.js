const express = require("express");
const SpaceRouter = new express.Router();
const auth = require("../middleware/auth");
const {
    createSpace,
    getSpaces,
    getSpaceById,
    updateSpace,
    deleteSpace 
  } = require("../controller/SpaceController");

  // create new space
  SpaceRouter.post("/spaces/", createSpace);

  // get all spaces
  SpaceRouter.get("/spaces/", getSpaces);

  // get space with a spaceId
  SpaceRouter.get("/spaces/:spaceId", getSpaceById);

  // update a space
  SpaceRouter.patch("/spaces/:spaceId", auth, updateSpace);

  // delete a space
  SpaceRouter.delete("/spaces/:spaceId", auth, deleteSpace);
  

  module.exports = {SpaceRoutes:SpaceRouter};