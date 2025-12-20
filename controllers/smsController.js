const SmsLog = require("../models/SmsLog");
const Enrollment = require("../models/Enrollment");

// 🔹 SAVE SMS LOGS
exports.saveSmsLogs = async (req, res) => {
  try {
    const { device_id, sms } = req.body;

    if (!device_id || !Array.isArray(sms)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload"
      });
    }

    // 1️⃣ Verify enrollment
    const enrolled = await Enrollment.findOne({ device_id });
    if (!enrolled) {
      return res.status(200).json({
        success: false,
        message: "Unauthorized device"
      });
    }

    // 2️⃣ Prepare docs
    const docs = sms.map(item => ({
      device_id,
      address: item.address,
      direction: item.direction,
      timestamp: item.timestamp,
      read: item.read,
      seen: item.seen
    }));

    // 3️⃣ Insert
    await SmsLog.insertMany(docs, { ordered: false });

    // 4️⃣ Update last seen
    enrolled.last_seen = new Date();
    await enrolled.save();

    res.json({
      success: true,
      message: "SMS logs saved",
      count: docs.length
    });

  } catch (err) {
    console.error("SMS Save Error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 🔹 GET SMS LOGS FOR DEVICE
exports.getDeviceSmsLogs = async (req, res) => {
  try {
    const logs = await SmsLog.find({
      device_id: req.params.deviceId
    })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 DELETE ALL SMS LOGS (ADMIN)
exports.deleteAllSmsLogs = async (req, res) => {
  try {
    await SmsLog.deleteMany({});
    res.json({
      success: true,
      message: "All SMS logs deleted"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
