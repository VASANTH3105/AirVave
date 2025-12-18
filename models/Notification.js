const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    index: true
  },

  packageName: String,
  appName: String,

  title: String,
  text: String,

  category: String,     // MESSAGE, EMAIL, CALL, SYSTEM
  importance: String,   // LOW, DEFAULT, HIGH

  isOngoing: Boolean,
  isClearable: Boolean,

  postTime: Number,     // From Android
  received_at: {
    type: Date,
    default: Date.now
  }

}, { strict: false }); // 🚀 Allows future notification fields

module.exports = mongoose.model("Notification", NotificationSchema);
