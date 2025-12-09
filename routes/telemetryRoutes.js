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

// NEW ROUTE
router.post("/launcher", controller.toggleLauncher);

router.delete("/telemetry", controller.deleteAllTelemetry); // NEW ROUTE

module.exports = router;