const Telemetry = require("../models/Telemetry");
const Enrollment = require("../models/Enrollment");
const admin = require("firebase-admin");

// --- FIREBASE INITIALIZATION ---
// Load the key you downloaded from Firebase Console
try {
  const serviceAccount = require("../serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("🔥 Firebase Admin Initialized");
} catch (e) {
  console.error("❌ Firebase Init Failed (Check serviceAccountKey.json):", e.message);
}

// --- TELEMETRY FUNCTIONS ---

exports.saveTelemetry = async (req, res) => {
  try {
    const data = req.body;
    const deviceId = data.device_id;

    // 1. Security Check: Is device enrolled?
    const enrolledDevice = await Enrollment.findOne({ device_id: deviceId });

    if (!enrolledDevice) {
      return res.status(200).json({
        success: false,
        message: "Unauthorized: Device not found or Unenrolled", 
      });
    }

    // 2. Save Data
    await Telemetry.create(data);

    // 3. Update Last Seen
    enrolledDevice.last_seen = new Date();
    await enrolledDevice.save();

    return res.status(200).json({
      success: true,
      message: "Telemetry saved",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
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

// --- NEW: INSTANT SYNC COMMAND ---
exports.forceSyncDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;

    // 1. Find the device's FCM Token
    const device = await Enrollment.findOne({ device_id: deviceId });
    
    if (!device || !device.fcm_token) {
      return res.status(404).json({ 
        success: false, 
        message: "Device not found or no FCM token available" 
      });
    }

    // 2. Create the High-Priority Data Message
    const message = {
      token: device.fcm_token,
      data: {
        action: "FORCE_SYNC" // This keyword triggers the Android service
      },
      android: {
        priority: "high" // Wakes up the device even if in Doze mode
      }
    };

    // 3. Send via Firebase
    await admin.messaging().send(message);
    console.log(`🚀 Sync command sent to ${deviceId}`);

    res.json({ success: true, message: "Sync command sent successfully" });

  } catch (err) {
    console.error("Sync Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};