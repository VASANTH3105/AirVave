const express = require("express");
const router = express.Router();
const controller = require("../controllers/telemetryController");

// Post data from Android
router.post("/telemetry", controller.saveTelemetry);

// Admin dashboard routes
router.get("/devices", controller.getAllDevices);
router.get("/telemetry/:deviceId", controller.getDeviceTelemetry);

// ⚡ NEW: Admin Force Sync Button
router.post("/sync", controller.forceSyncDevice);

module.exports = router;