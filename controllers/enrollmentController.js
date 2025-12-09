const Enrollment = require("../models/Enrollment");
const admin = require("firebase-admin"); // Required for the wipe command

// --- ENROLL DEVICE ---
exports.enrollDevice = async (req, res) => {
  try {
    const { email, deviceId, fcmToken, model } = req.body;

    // Check if exists
    let device = await Enrollment.findOne({ device_id: deviceId });

    if (device) {
      // Update existing
      device.email = email;
      device.fcm_token = fcmToken;
      device.model = model;
      device.enrolled_at = Date.now();
      await device.save();

      return res.status(200).json({
        success: true,
        deviceEnrolled: true,
        message: "Device re-enrolled successfully",
      });
    }

    // Create new
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

// --- UNENROLL DEVICE (This was likely missing!) ---
exports.unenrollDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;

    // 1. Try to send Wipe Command via Firebase
    const device = await Enrollment.findOne({ device_id: deviceId });

    if (device && device.fcm_token) {
      const message = {
        token: device.fcm_token,
        data: { action: "UNENROLL" },
        android: { priority: "high" }
      };

      try {
        await admin.messaging().send(message);
        console.log(`🧨 Wipe command sent to ${deviceId}`);
      } catch (fcmError) {
        console.error("FCM Error:", fcmError.message);
      }
    }

    // 2. Delete from Database
    await Enrollment.findOneAndDelete({ device_id: deviceId });

    res.json({ success: true, message: "Device wiped and removed from database" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};