"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const queueController_1 = require("../controllers/queueController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /api/queue/stats:
 *   get:
 *     summary: Get queue statistics
 *     description: Returns statistics about the post publishing queue including waiting, active, completed, failed, and delayed jobs
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Queue statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     waiting:
 *                       type: integer
 *                       description: Number of jobs waiting to be processed
 *                       example: 0
 *                     active:
 *                       type: integer
 *                       description: Number of jobs currently being processed
 *                       example: 0
 *                     completed:
 *                       type: integer
 *                       description: Number of successfully completed jobs
 *                       example: 5
 *                     failed:
 *                       type: integer
 *                       description: Number of failed jobs
 *                       example: 0
 *                     delayed:
 *                       type: integer
 *                       description: Number of scheduled jobs waiting for their time
 *                       example: 1
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats', queueController_1.getQueueStatsController);
exports.default = router;
