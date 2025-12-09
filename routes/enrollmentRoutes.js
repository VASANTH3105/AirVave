const express = require("express");
const router = express.Router();
const controller = require("../controllers/enrollmentController");

// Route for Enrollment
router.post("/enroll", controller.enrollDevice);

// Route for Unenrollment (Make sure controller.unenrollDevice exists now!)
router.post("/unenroll", controller.unenrollDevice);

module.exports = router;