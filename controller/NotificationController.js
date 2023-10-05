const { Notification } = require('../models');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const notification = req.body.notification;
    const newNotification = new Notification({
      sender: notification.sender,
      receiver: notification.receiver,
      notificationType: notification.notificationType,
      seen: notification.seen,
      intent: notification.intent
    });
    await newNotification.save();
    return res.status(201).json(newNotification);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating notification' });
  }
};

// Get all notifications for a user
const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.params.receiver }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Mark a notification as seen
const markNotificationAsSeen = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params._id,
      { seen: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params._id);
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


module.exports = {
  createNotification,
  getNotificationsByUser,
  markNotificationAsSeen,
  deleteNotification
}