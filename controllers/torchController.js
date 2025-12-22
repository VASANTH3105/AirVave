const Enrollment = require("../models/Enrollment");
const DeviceCommand = require("../models/DeviceCommand");
const admin = require("firebase-admin");

// 🔥 SEND TORCH COMMAND (ADMIN → DEVICE)
exports.toggleTorch = async (req, res) => {
  try {
    const { deviceId, enable } = req.body; 
    // enable = true → TORCH_ON, false → TORCH_OFF

    const device = await Enrollment.findOne({ device_id: deviceId });

    if (!device || !device.fcm_token) {
      return res.status(404).json({
        success: false,
        message: "Device not found or FCM token missing"
      });
    }

    const commandType = enable ? "TORCH_ON" : "TORCH_OFF";

    // 1️⃣ Save command in DB
    const command = await DeviceCommand.create({
      device_id: deviceId,
      command: commandType
    });

    // 2️⃣ Send FCM (High Priority)
    await admin.messaging().send({
      token: device.fcm_token,
      data: {
        action: commandType,
        command_id: command._id.toString()
      },
      android: {
        priority: "high"
      }
    });

    // 3️⃣ Update status
    command.status = "SENT";
    await command.save();

    console.log(`🔥 ${commandType} sent to ${deviceId}`);

    res.json({
      success: true,
      message: `Torch ${enable ? "ON" : "OFF"} command sent`,
      command_id: command._id
    });

  } catch (err) {
    console.error("Torch Toggle Error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 📲 DEVICE → SERVER (STATUS CALLBACK)
exports.updateCommandStatus = async (req, res) => {
  try {
    const { command_id, status, message } = req.body;

    const command = await DeviceCommand.findById(command_id);
    if (!command) {
      return res.status(404).json({ success: false, message: "Command not found" });
    }

    command.status = status; // EXECUTED / FAILED
    command.message = message;
    command.executed_at = new Date();

    await command.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📜 ADMIN → HISTORY
exports.getDeviceCommands = async (req, res) => {
  try {
    const commands = await DeviceCommand.find({
      device_id: req.params.deviceId
    }).sort({ created_at: -1 });

    res.json(commands);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
