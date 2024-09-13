const express = require("express");
const RefreshTokenRouter = new express.Router();
const auth = require("../middleware/auth");
const {
  logoutAllSessions,
  refreshAccessToken
} = require("../controller/RefreshTokenController");

RefreshTokenRouter.post("/api/logout-all-sessions", auth, logoutAllSessions);
RefreshTokenRouter.post("/api/refresh-access-token", refreshAccessToken);

module.exports = { RefreshTokenRoutes: RefreshTokenRouter };
