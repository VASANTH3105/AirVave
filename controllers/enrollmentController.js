const Enrollment = require("../models/Enrollment");
const admin = require("firebase-admin"); // Ensure this is imported

exports.unenrollDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;

    // 1. Find device to get the Token
    const device = await Enrollment.findOne({ device_id: deviceId });

    if (device && device.fcm_token) {
      // 2. Send "UNENROLL" Command via FCM
      const message = {
        token: device.fcm_token,
        data: {
          action: "UNENROLL" // <--- The Trigger
        },
        android: {
          priority: "high" // Wake up device immediately
        }
      };

      try {
        await admin.messaging().send(message);
        console.log(`🧨 Wipe command sent to ${deviceId}`);
      } catch (fcmError) {
        console.error("FCM Error (Device might be unreachable):", fcmError.message);
      }
    }

    // 3. Delete from Database
    await Enrollment.findOneAndDelete({ device_id: deviceId });

    res.json({ success: true, message: "Device wiped and removed from database" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};