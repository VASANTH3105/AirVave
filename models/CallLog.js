const mongoose = require("mongoose");

const CallLogSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    index: true
  },

  number: String,
  name: String,

  type: {
    type: String, // INCOMING, OUTGOING, MISSED, REJECTED
  },

  start_time: Number,      // timestamp (ms)
  duration_sec: Number,

  sim_slot: String,        // SIM1 / SIM2
  location: String,        // City / Region
  is_missed: Boolean,

  received_at: {
    type: Date,
    default: Date.now
  }

}, { strict: false }); // allow future fields

module.exports = mongoose.model("CallLog", CallLogSchema);
