const mongoose = require("mongoose");

const TelemetrySchema = new mongoose.Schema({
  device_id: { type: String, required: true, index: true },
  battery: Number,
  charging: Boolean,
  network_type: String,
  location: {
    lat: Number,
    lng: Number,
    accuracy: Number
  },
  // We make this flexible to accept any other fields you send
  installed_apps: Array,
  
  received_at: {
    type: Date,
    default: Date.now,
  }
}, { strict: false }); // Strict false allows you to add fields from Android without changing Schema

module.exports = mongoose.model("Telemetry", TelemetrySchema);