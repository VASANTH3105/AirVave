const CallLog = require("../models/CallLog");
const Enrollment = require("../models/Enrollment");

// --- UPLOAD CALL LOGS ---
exports.uploadCallLogs = async (req, res) => {
  try {
    const { device_id, calls } = req.body;

    if (!device_id || !Array.isArray(calls)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload"
      });
    }

    // 1️⃣ Verify device enrollment
    const enrolled = await Enrollment.findOne({ device_id });
    if (!enrolled) {
      return res.status(200).json({
        success: false,
        message: "Unauthorized device"
      });
    }

    // 2️⃣ Normalize & attach device_id
    const records = calls.map(call => ({
      ...call,
      device_id
    }));

    // 3️⃣ Insert efficiently
    await CallLog.insertMany(records, { ordered: false });

    // 4️⃣ Update last seen
    enrolled.last_seen = new Date();
    await enrolled.save();

    return res.json({
      success: true,
      count: records.length,
      message: "Call logs stored successfully"
    });

  } catch (err) {
    console.error("Call Log Upload Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// --- GET CALL LOGS BY DEVICE ---
exports.getDeviceCallLogs = async (req, res) => {
  try {
    const logs = await CallLog.find({
      device_id: req.params.deviceId
    })
      .sort({ start_time: -1 })
      .limit(100);

    res.json(logs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- DELETE ALL CALL LOGS (ADMIN) ---
exports.deleteAllCallLogs = async (_req, res) => {
  try {
    await CallLog.deleteMany({});
    res.json({
      success: true,
      message: "All call logs deleted"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
