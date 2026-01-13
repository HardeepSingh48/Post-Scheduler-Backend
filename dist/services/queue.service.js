"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueStats = exports.reschedulePostInQueue = exports.removePostFromQueue = exports.addPostToQueue = exports.postQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.postQueue = new bullmq_1.Queue('post-publishing', {
    connection: redis_1.redis,
    defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 50,
    },
});
const addPostToQueue = async (postId, scheduledAt) => {
    const scheduledDate = scheduledAt instanceof Date ? scheduledAt : new Date(scheduledAt);
    const delay = scheduledDate.getTime() - Date.now();
    if (delay > 0) {
        await exports.postQueue.add('publish-post', { postId }, { delay });
    }
    else {
        await exports.postQueue.add('publish-post', { postId });
    }
};
exports.addPostToQueue = addPostToQueue;
const removePostFromQueue = async (postId) => {
    const jobs = await exports.postQueue.getJobs(['delayed', 'waiting', 'active']);
    for (const job of jobs) {
        if (job.data.postId === postId) {
            await job.remove();
        }
    }
};
exports.removePostFromQueue = removePostFromQueue;
const reschedulePostInQueue = async (postId, newScheduledAt) => {
    await (0, exports.removePostFromQueue)(postId);
    await (0, exports.addPostToQueue)(postId, newScheduledAt);
};
exports.reschedulePostInQueue = reschedulePostInQueue;
const getQueueStats = async () => {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
        exports.postQueue.getWaiting(),
        exports.postQueue.getActive(),
        exports.postQueue.getCompleted(),
        exports.postQueue.getFailed(),
        exports.postQueue.getDelayed(),
    ]);
    return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
    };
};
exports.getQueueStats = getQueueStats;
