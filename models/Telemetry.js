const mongoose = require("mongoose");

const TelemetrySchema = new mongoose.Schema({
  device_id: String,
  manufacturer: String,
  model: String,
  os_version: String,
  sdk_version: Number,
  app_version: String,

  battery: Number,
  charging: Boolean,
  charging_type: String,
  network_type: String,
  uptime_ms: Number,

  installed_apps: [
    {
      package: String,
      name: String
    }
  ],

  location: {
    lat: Number,
    lng: Number,
    accuracy: Number
  },

  received_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Telemetry", TelemetrySchema);
