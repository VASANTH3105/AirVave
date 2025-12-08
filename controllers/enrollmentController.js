const Enrollment = require("../models/Enrollment");

exports.enrollDevice = async (req, res) => {
  try {
    const { email, deviceId, fcmToken, model } = req.body;

    // 🔍 Check if device already enrolled
    const exists = await Enrollment.findOne({ device_id: deviceId });
    if (exists) {
      return res.status(200).json({
        success: false,
        deviceEnrolled: false,
        message: "Device already enrolled",
      });
    }

    // 📥 Save new enrollment
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
