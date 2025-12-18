const Notification = require("../models/Notification");
const Enrollment = require("../models/Enrollment");

// --- SAVE NOTIFICATION ---
exports.saveNotification = async (req, res) => {
  try {
    const data = req.body;
    const deviceId = data.device_id;

    // 1. Security: Check enrollment
    const enrolled = await Enrollment.findOne({ device_id: deviceId });
    if (!enrolled) {
      return res.status(200).json({
        success: false,
        message: "Unauthorized device"
      });
    }

    // 2. Save notification
    await Notification.create(data);

    // 3. Update last seen
    enrolled.last_seen = new Date();
    await enrolled.save();

    res.json({
      success: true,
      message: "Notification saved"
    });

  } catch (err) {
    console.error("Notification Save Error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// --- GET DEVICE NOTIFICATIONS ---
exports.getDeviceNotifications = async (req, res) => {
  try {
    const logs = await Notification.find({
      device_id: req.params.deviceId
    })
      .sort({ received_at: -1 })
      .limit(100);

    res.json(logs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- DELETE ALL NOTIFICATIONS ---
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({
      success: true,
      message: "All notifications deleted"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
