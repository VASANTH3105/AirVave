const Telemetry = require("../models/Telemetry"); // Ensure you have this model
const Enrollment = require("../models/Enrollment");

exports.saveTelemetry = async (req, res) => {
  try {
    const data = req.body;
    const deviceId = data.device_id;

    // --- 1. SECURITY CHECK ---
    // Check if this device is actually enrolled in your system
    const enrolledDevice = await Enrollment.findOne({ device_id: deviceId });

    if (!enrolledDevice) {
      // 🚨 CRITICAL: This specific message triggers the wipe on the Android side
      return res.status(200).json({
        success: false,
        message: "Unauthorized: Device not found or Unenrolled", 
      });
    }

    // --- 2. SAVE DATA ---
    // (Optional: Upsert so we only keep the latest state per device, or .create to keep history)
    await Telemetry.create(data);

    // --- 3. UPDATE LAST SEEN ---
    enrolledDevice.last_seen = new Date();
    await enrolledDevice.save();

    return res.status(200).json({
      success: true,
      message: "Telemetry saved",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Enrollment.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDeviceTelemetry = async (req, res) => {
  try {
    const logs = await Telemetry.find({ device_id: req.params.deviceId })
      .sort({ received_at: -1 })
      .limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};