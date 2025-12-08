const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  device_id: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  fcm_token: { type: String, required: true },

  enrolled_at: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
