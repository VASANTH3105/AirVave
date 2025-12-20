const express = require("express");
const router = express.Router();
const controller = require("../controllers/callLogController");

// Android → Server
router.post("/call-logs", controller.uploadCallLogs);

// Admin
router.get("/call-logs/:deviceId", controller.getDeviceCallLogs);
router.delete("/call-logs", controller.deleteAllCallLogs);

module.exports = router;
