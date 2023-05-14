const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    receiver: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    }],
    notificationType: {
      type: String,
      enum: ['joinedSpace', 'leftSpace', 'postComment', 'commentReply', 'commentMention', 'newPost'],
      required: true
    },
    seen: {
      type: Boolean,
      default: false
    },
    intent: {
      action: String,
      parameters: {
        type: Object,
      }
    },
  },
  { timestamps: true },
);

module.exports = notificationSchema;
