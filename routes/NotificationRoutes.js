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
  NotificationRouter.post("/api/notifications", createNotification);

  // Get all notifications for a user
  NotificationRouter.get("/api/notifications/:userId", getNotificationsByUser);

  // Mark a notification as seen
  NotificationRouter.patch("/api/notifications/seen", auth, markNotificationAsSeen);

  // delete a comment
  NotificationRouter.delete("/api/notifications/:commentId", auth, deleteNotification);
  

  module.exports = {NotificationRoutes:NotificationRouter};
