const mongoose = require("mongoose");

const DeviceCommandSchema = new mongoose.Schema({
  device_id: { type: String, required: true, index: true },

  command: {
    type: String,
    enum: ["TORCH_ON", "TORCH_OFF"],
    required: true
  },

  status: {
    type: String,
    enum: ["PENDING", "SENT", "EXECUTED", "FAILED"],
    default: "PENDING"
  },

  message: String,

  created_at: { type: Date, default: Date.now },
  executed_at: Date
});

module.exports = mongoose.model("DeviceCommand", DeviceCommandSchema);
