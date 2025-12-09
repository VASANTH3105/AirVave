const Enrollment = require("../models/Enrollment");

// --- ENROLL (Updated to handle Re-enrollment) ---
exports.enrollDevice = async (req, res) => {
  try {
    const { email, deviceId, fcmToken, model } = req.body;

    // Check if exists
    let device = await Enrollment.findOne({ device_id: deviceId });

    if (device) {
      // DEVICE EXISTS: Update details (Re-enrollment)
      device.email = email;
      device.fcm_token = fcmToken; // Important: Token might have changed
      device.model = model;
      device.enrolled_at = Date.now();
      await device.save();

      return res.status(200).json({
        success: true,
        deviceEnrolled: true,
        message: "Device re-enrolled successfully",
      });
    }

    // NEW DEVICE
    await Enrollment.create({
      email,
      device_id: deviceId,
      fcm_token: fcmToken,
      model,
    });

    res.status(200).json({
      success: true,
      deviceEnrolled: true,
      message: "Device enrollment completed",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      deviceEnrolled: false,
      message: err.message,
    });
  }
};

// --- MANUAL UNENROLL (For Admin Testing) ---
exports.unenrollDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;
    await Enrollment.findOneAndDelete({ device_id: deviceId });
    
    res.json({ success: true, message: "Device removed from database" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};