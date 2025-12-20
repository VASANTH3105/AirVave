const mongoose = require("mongoose");

const SmsLogSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    index: true
  },

  address: String,
  direction: {
    type: String, // INCOMING | OUTGOING
    enum: ["INCOMING", "OUTGOING"]
  },

  timestamp: Number, // From Android
  read: Boolean,
  seen: Boolean,

  received_at: {
    type: Date,
    default: Date.now
  }

}, { strict: true });

module.exports = mongoose.model("SmsLog", SmsLogSchema);
