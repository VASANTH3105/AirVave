const express = require("express");
const router = express.Router();
const controller = require("../controllers/torchController");

/**
 * @swagger
 * /torch:
 *   post:
 *     summary: Turn device torch ON or OFF
 *     tags: [Device Commands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - enable
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: AIRVAVE-001
 *               enable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Command sent successfully
 *       404:
 *         description: Device not found
 */
router.post("/torch", controller.toggleTorch);

/**
 * @swagger
 * /command/status:
 *   post:
 *     summary: Device reports command execution status
 *     tags: [Device Commands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - command_id
 *               - status
 *             properties:
 *               command_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [EXECUTED, FAILED]
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.post("/command/status", controller.updateCommandStatus);

module.exports = router;
