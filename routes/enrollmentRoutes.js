const express = require("express");
const router = express.Router();
const controller = require("../controllers/enrollmentController");

router.post("/enroll", controller.enrollDevice);

module.exports = router;
