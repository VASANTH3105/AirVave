const express = require("express");
const router = express.Router();
const controller = require("../controllers/smsController");

// Android → Server
router.post("/sms", controller.saveSmsLogs);

// Admin APIs
router.get("/sms/:deviceId", controller.getDeviceSmsLogs);
router.delete("/sms", controller.deleteAllSmsLogs);

module.exports = router;
