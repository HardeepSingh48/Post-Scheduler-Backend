"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostSchema = exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string(),
        scheduledAt: zod_1.z.string().optional(),
        mediaUrls: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updatePostSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().optional(),
        scheduledAt: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
        mediaUrls: zod_1.z.array(zod_1.z.string()).optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
exports.getPostSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
