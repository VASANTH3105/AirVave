const express = require("express");
const router = express.Router();
const controller = require("../controllers/enrollmentController");

router.post("/enroll", controller.enrollDevice);
router.post("/unenroll", controller.unenrollDevice); // <--- Add this

module.exports = router;