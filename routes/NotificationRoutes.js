const express = require("express");
const NotificationRouter = new express.Router();
const auth = require("../middleware/auth");
const {
    createNotification,
    getNotificationsByUser,
    markNotificationAsSeen,
    deleteNotification
  } = require("../controller/NotificationController");

  // create new comment
  NotificationRouter.post("/notifications", createNotification);

  // Get all notifications for a user
  NotificationRouter.get("/notifications/:receiver", getNotificationsByUser);

  // Mark a notification as seen
  NotificationRouter.patch("/notifications/seen", auth, markNotificationAsSeen);

  // delete a comment
  NotificationRouter.delete("/notifications/:commentId", auth, deleteNotification);
  

  module.exports = {NotificationRoutes:NotificationRouter};