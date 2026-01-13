"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
const worker = new bullmq_1.Worker('post-publishing', async (job) => {
    const { postId } = job.data;
    try {
        const post = await database_1.default.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            console.error(`Post ${postId} not found`);
            return;
        }
        // TODO: Implement actual publishing logic here
        // For now, we'll simulate successful publishing
        console.log(`Publishing post ${postId}:`, post.content);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Update status to PUBLISHED with timestamp
        await database_1.default.post.update({
            where: { id: postId },
            data: {
                status: client_1.PostStatus.PUBLISHED,
                publishedAt: new Date(),
            },
        });
        console.log(`Successfully published post ${postId}`);
    }
    catch (error) {
        console.error(`Failed to publish post ${postId}:`, error);
        // Update status to FAILED and store error
        await database_1.default.post.update({
            where: { id: postId },
            data: {
                status: client_1.PostStatus.FAILED,
                lastError: error instanceof Error ? error.message : 'Unknown error',
                attempts: { increment: 1 },
            },
        });
        throw error;
    }
}, {
    connection: redis_1.redis,
});
worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});
worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});
exports.default = worker;
