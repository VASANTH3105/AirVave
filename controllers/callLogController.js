const CallLog = require("../models/CallLog");
const Enrollment = require("../models/Enrollment");

// --- SAVE CALL LOGS ---
exports.saveCallLogs = async (req, res) => {
  try {
    const { device_id, calls } = req.body;

    if (!device_id || !Array.isArray(calls)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload"
      });
    }

    // 1. Security check
    const enrolled = await Enrollment.findOne({ device_id });
    if (!enrolled) {
      return res.status(200).json({
        success: false,
        message: "Unauthorized device"
      });
    }

    // 2. Attach device_id to each call
    const records = calls.map(call => ({
      device_id,
      ...call
    }));

    // 3. Save batch
    await CallLog.insertMany(records);

    // 4. Update last seen
    enrolled.last_seen = new Date();
    await enrolled.save();

    res.json({
      success: true,
      message: "Call logs saved",
      count: records.length
    });

  } catch (err) {
    console.error("CallLog Save Error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// --- GET CALL LOGS FOR DEVICE ---
exports.getDeviceCallLogs = async (req, res) => {
  try {
    const logs = await CallLog.find({
      device_id: req.params.deviceId
    })
      .sort({ start_time: -1 })
      .limit(200);

    res.json(logs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- DELETE ALL CALL LOGS ---
exports.deleteAllCallLogs = async (req, res) => {
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
