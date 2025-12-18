const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

// Android → Server
router.post("/notifications", controller.saveNotification);

// Admin APIs
router.get("/notifications/:deviceId", controller.getDeviceNotifications);
router.delete("/notifications", controller.deleteAllNotifications);

module.exports = router;
