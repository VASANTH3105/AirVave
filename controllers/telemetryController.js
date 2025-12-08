const Telemetry = require("../models/Telemetry");

exports.saveTelemetry = async (req, res) => {
  try {
    const data = await Telemetry.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Telemetry.aggregate([
      { $sort: { received_at: -1 } },
      {
        $group: {
          _id: "$device_id",
          last_record: { $first: "$$ROOT" }
        }
      }
    ]);

    res.json({ success: true, devices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDeviceTelemetry = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const telemetry = await Telemetry.find({ device_id: deviceId }).sort({
      received_at: -1
    });

    res.json({ success: true, telemetry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
