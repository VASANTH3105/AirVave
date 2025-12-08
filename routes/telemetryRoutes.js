const express = require("express");
const router = express.Router();
const controller = require("../controllers/telemetryController");

router.post("/telemetry", controller.saveTelemetry);
router.get("/devices", controller.getAllDevices);
router.get("/telemetry/:deviceId", controller.getDeviceTelemetry);

module.exports = router;
