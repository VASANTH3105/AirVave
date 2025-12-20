const mongoose = require("mongoose");

const CallLogSchema = new mongoose.Schema(
  {
    device_id: {
      type: String,
      required: true,
      index: true
    },

    number: String,
    name: String,

    type: {
      type: String,
      enum: ["INCOMING", "OUTGOING", "MISSED", "UNKNOWN"],
      required: true
    },

    start_time: {
      type: Number,
      required: true
    },

    duration_sec: {
      type: Number,
      default: 0
    },

    is_missed: {
      type: Boolean,
      default: false
    },

    // 🔥 NEW FIELDS (from updated DTO)
    subscription_id: String,     // SIM subscription ID
    country_iso: String,         // "IN", "US"
    geocoded_location: String,   // "Chennai, India"
    features: String,            // "HD", "VIDEO", "WIFI"
    data_usage: Number,          // bytes

    received_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    strict: false // 🚀 allows future Android-side fields without schema changes
  }
);

module.exports = mongoose.model("CallLog", CallLogSchema);
