"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueStatsController = void 0;
const queue_service_1 = require("../services/queue.service");
const getQueueStatsController = async (_req, res, next) => {
    try {
        const stats = await (0, queue_service_1.getQueueStats)();
        res.status(200).json({ status: 'success', data: stats });
    }
    catch (error) {
        next(error);
    }
};
exports.getQueueStatsController = getQueueStatsController;
