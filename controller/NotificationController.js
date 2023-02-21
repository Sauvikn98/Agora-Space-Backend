const {Notification} = require('../models');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const notification = new Notification({
      userId: req.body.userId,
      notificationType: req.body.notificationType,
      intent: req.body.intent
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Get all notifications for a user
const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
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